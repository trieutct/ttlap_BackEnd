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
import * as fs from 'fs';
import {
    ErrorResponse,
    SuccessResponse,
} from '../../../common/helpers/response';
import { HttpStatus, mongoIdSchema } from '../../../common/constants';
import {
    CreateProductDto,
    GetProductListQuery,
    UpdateProductDto,
} from '../product.interface';
import {
    ApiResponseError,
    SwaggerApiType,
    ApiResponseSuccess,
} from '../../../common/services/swagger.service';
import { ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';

import {
    createProductSuccessResponseExample,
    deleteProductSuccessResponseExample,
    getProductDetailSuccessResponseExample,
    getProductListSuccessResponseExample,
    updateProductSuccessResponseExample,
} from '../product.swagger';
import { TrimBodyPipe } from '../../../common/pipe/trim.body.pipe';
import { toObjectId } from '../../../common/helpers/commonFunctions';
import { BaseController } from '../../../common/base/base.controller';
import { JoiValidationPipe } from '../../../common/pipe/joi.validation.pipe';
import { ProductService } from '../services/product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../../../common/cloudinary/cloudinary.service';

@ApiTags('Product APIs')
@Controller('product')
export class ProductController extends BaseController {
    constructor(
        private readonly productService: ProductService,
        private readonly cloudinaryService: CloudinaryService,
    ) {
        super();
    }

    @ApiOperation({ summary: 'Create Product' })
    @ApiResponseError([SwaggerApiType.CREATE])
    @ApiResponseSuccess(createProductSuccessResponseExample)
    @ApiBody({ type: CreateProductDto })
    @UseInterceptors(FileInterceptor('file'))
    @Post()
    async createProduct(
        @Body(new TrimBodyPipe(), new JoiValidationPipe())
        dto: CreateProductDto,
        @UploadedFile() file?,
    ) {
        try {
            if (file != null) {
                const url = await this.cloudinaryService.uploadImage(file);
                dto.imageUrl = url;
            }
            const result = await this.productService.createProduct(dto);
            return result;
        } catch (error) {
            this.handleError(error);
            // Có thể thêm hành động khác tùy thuộc vào yêu cầu của bạn, ví dụ trả về response lỗi cụ thể.
        }
    }

    @ApiOperation({ summary: 'Update Product by id' })
    @ApiResponseError([SwaggerApiType.UPDATE])
    @ApiResponseSuccess(updateProductSuccessResponseExample)
    @ApiBody({ type: UpdateProductDto })
    @UseInterceptors(FileInterceptor('file'))
    @Patch(':id')
    async updateProduct(
        @Param('id', new JoiValidationPipe(mongoIdSchema)) id: string,
        @Body(new TrimBodyPipe(), new JoiValidationPipe())
        dto: UpdateProductDto,
        @UploadedFile() file?,
    ) {
        try {
            const product = await this.productService.findProductById(
                toObjectId(id),
            );
            if (!product) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                    this.translate('Product.error.notFound', {
                        args: {
                            id,
                        },
                    }),
                );
            }
            if (file != null) {
                const imagePath =
                    product.imageUrl === '' ? null : `./${product.imageUrl}`;
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
                dto.imageUrl = `/data/${file.filename}`;
            }
            const result = await this.productService.updateProduct(
                toObjectId(id),
                dto,
            );
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @ApiOperation({ summary: 'Delete Product by id' })
    @ApiResponseError([SwaggerApiType.DELETE])
    @ApiResponseSuccess(deleteProductSuccessResponseExample)
    @Delete(':id')
    async deleteProduct(
        @Param('id', new JoiValidationPipe(mongoIdSchema)) id: string,
    ) {
        try {
            const product = await this.productService.findProductById(
                toObjectId(id),
            );

            if (!product) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                    this.translate('Product.error.notFound', {
                        args: {
                            id,
                        },
                    }),
                );
            }

            const imagePath =
                product.imageUrl === '' ? null : `./${product.imageUrl}`;
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
            const result = await this.productService.deleteProduct(
                toObjectId(id),
            );
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @ApiOperation({ summary: 'Get Product detail by id' })
    @ApiResponseError([SwaggerApiType.GET_DETAIL])
    @ApiResponseSuccess(getProductDetailSuccessResponseExample)
    @Get(':id')
    async getProductDetail(
        @Param('id', new JoiValidationPipe(mongoIdSchema)) id: string,
    ) {
        try {
            const result = await this.productService.findProductById(
                toObjectId(id),
            );

            if (!result) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                    this.translate('Product.error.notFound', {
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

    @ApiOperation({ summary: 'Get Product list' })
    @ApiResponseError([SwaggerApiType.GET_LIST])
    @ApiResponseSuccess(getProductListSuccessResponseExample)
    @Get()
    async getProductList(
        @Query(new JoiValidationPipe())
        query: GetProductListQuery,
    ) {
        try {
            const result =
                await this.productService.findAllAndCountProductByQuery(query);
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }
}
