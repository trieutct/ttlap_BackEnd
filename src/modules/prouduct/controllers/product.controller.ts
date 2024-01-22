import {
    Controller,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Get,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ErrorResponse, SuccessResponse } from '@/common/helpers/response';
import { HttpStatus, mongoIdSchema } from '@/common/constants';
import {
    CreateProductDto,
    GetProductListQuery,
    UpdateProductDto,
} from '../product.interface';
import {
    ApiResponseError,
    SwaggerApiType,
    ApiResponseSuccess,
} from '@/common/services/swagger.service';
import { ApiOperation, ApiBody, ApiTags, ApiConsumes } from '@nestjs/swagger';

import {
    createProductSuccessResponseExample,
    deleteProductSuccessResponseExample,
    getProductDetailSuccessResponseExample,
    getProductListSuccessResponseExample,
    updateProductSuccessResponseExample,
} from '../product.swagger';
import { TrimBodyPipe } from '@/common/pipe/trim.body.pipe';
import { toObjectId } from '@/common/helpers/commonFunctions';
import { BaseController } from '@/common/base/base.controller';
import { JoiValidationPipe } from '@/common/pipe/joi.validation.pipe';
import { ProductService } from '../services/product.service';
import { FileInterceptor } from '@nestjs/platform-express';
@ApiTags('Product APIs')
@Controller('product')
export class ProductController extends BaseController {
    constructor(private readonly ProductService: ProductService) {
        super();
    }
    @ApiOperation({ summary: 'Create User' })
    @ApiResponseError([SwaggerApiType.CREATE])
    @ApiResponseSuccess(createProductSuccessResponseExample)
    @ApiBody({ type: CreateProductDto })
    @UseInterceptors(FileInterceptor('file'))
    @Post()
    async createUser(
        @Body(new TrimBodyPipe(), new JoiValidationPipe())
        dto: CreateProductDto,
        @UploadedFile() file
    ) {
        console.log(file)
        try {
            //console.log(file)
            // const result = await this.ProductService.createUser(dto);
            // //console.log(new SuccessResponse(result))
            // return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @ApiOperation({ summary: 'Update User by id' })
    @ApiResponseError([SwaggerApiType.UPDATE])
    @ApiResponseSuccess(updateProductSuccessResponseExample)
    @ApiBody({ type: UpdateProductDto })
    @Patch(':id')
    async updateUser(
        @Param('id', new JoiValidationPipe(mongoIdSchema)) id: string,
        @Body(new TrimBodyPipe(), new JoiValidationPipe())
        dto: UpdateProductDto,
    ) {
        try {
            const user = await this.ProductService.findUserById(toObjectId(id));
            if (!user) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                    this.translate('user.error.notFound', {
                        args: {
                            id,
                        },
                    }),
                );
            }

            const result = await this.ProductService.updateUser(
                toObjectId(id),
                dto,
            );
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @ApiOperation({ summary: 'Delete User by id' })
    @ApiResponseError([SwaggerApiType.DELETE])
    @ApiResponseSuccess(deleteProductSuccessResponseExample)
    @Delete(':id')
    async deleteUser(
        @Param('id', new JoiValidationPipe(mongoIdSchema)) id: string,
    ) {
        try {
            const user = await this.ProductService.findUserById(toObjectId(id));

            if (!user) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                    this.translate('user.error.notFound', {
                        args: {
                            id,
                        },
                    }),
                );
            }

            const result = await this.ProductService.deleteUser(toObjectId(id));
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @ApiOperation({ summary: 'Get User detail by id' })
    @ApiResponseError([SwaggerApiType.GET_DETAIL])
    @ApiResponseSuccess(getProductDetailSuccessResponseExample)
    @Get(':id')
    async getUserDetail(
        @Param('id', new JoiValidationPipe(mongoIdSchema)) id: string,
    ) {
        try {
            const result = await this.ProductService.findUserById(toObjectId(id));

            if (!result) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                    this.translate('user.error.notFound', {
                        args: {
                            id,
                        },
                    }),
                );
            }
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }
    @ApiOperation({ summary: 'Get User list' })
    @ApiResponseError([SwaggerApiType.GET_LIST])
    @ApiResponseSuccess(getProductListSuccessResponseExample)
    @Get()
    async getProductList(
        @Query(new JoiValidationPipe())
        query: GetProductListQuery,
    ) {
        //console.log(query)
        try {
            const result =
                await this.ProductService.findAllAndCountProductByQuery(query);
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }
}
