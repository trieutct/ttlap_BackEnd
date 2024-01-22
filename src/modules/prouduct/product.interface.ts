import { INPUT_TEXT_MAX_LENGTH } from '@/common/constants';
import { JoiValidate } from '@/common/decorators/validator.decorator';
import { ProductOrderBy } from './product.contant';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Joi from '@/plugins/joi';
import { CommonListQuery } from '@/common/interfaces';
import { RoleCollection } from '@/database/utils/constants';
export class CreateProductDto {
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'name',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    name: string;
}

export class UpdateProductDto {
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'name',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    name: string;
    
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'User name',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    username: string;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: '',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    password: string;

    @ApiProperty({
        type: Boolean, // Thay đổi kiểu dữ liệu thành Boolean
        default: RoleCollection.USERS, // Giá trị mặc định cho kiểu boolean
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    role: string;
}

export class GetProductListQuery extends CommonListQuery {
    @ApiPropertyOptional({
        enum: ProductOrderBy,
        description: 'Which field used to sort',
        default: ProductOrderBy.UPDATED_AT,
    })
    @JoiValidate(
        Joi.string()
            .valid(...Object.values(ProductOrderBy))
            .optional(),
    )
    orderBy?: ProductOrderBy;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: "User'name for filter",
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).optional())
    name?: string;
}