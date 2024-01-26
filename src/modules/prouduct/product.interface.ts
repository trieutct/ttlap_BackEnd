import { INPUT_TEXT_MAX_LENGTH } from '../../common/constants';
import { JoiValidate } from '../../common/decorators/validator.decorator';
import { ProductOrderBy } from './product.contant';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Joi from '../../plugins/joi';
import { CommonListQuery } from '../../common/interfaces';
import { RoleCollection } from '../../database/utils/constants';
export class CreateProductDto {
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'name',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    name: string;


    @ApiProperty({
        type: Number,
        default: 0,
    })
    @JoiValidate(Joi.number().required())
    price: Number;

    @ApiProperty({
        type: Number,
        default: 0,
    })
    @JoiValidate(Joi.number().required())
    quantity: Number;
    
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: '...',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    description: string;
    
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: '...',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).optional())
    imageUrl?: string;
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
        type: Number,
        default: 0,
    })
    @JoiValidate(Joi.number().required())
    price: Number;

    @ApiProperty({
        type: Number,
        default: 0,
    })
    @JoiValidate(Joi.number().required())
    quantity: Number;
    
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: '...',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    description: string;
    
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: '...',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).optional())
    imageUrl?: string;
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