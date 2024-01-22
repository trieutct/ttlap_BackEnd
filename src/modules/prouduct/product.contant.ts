import { Product } from "@/database/schemas/product.schema";
export enum ProductOrderBy {
    ID = 'id',
    CREATED_AT = 'created_at',
    UPDATED_AT = 'updatedAt',
}

export const ProductAttributesForList: (keyof Product)[] = [
    '_id',
    'id',
    'name',
    'createdAt',
    'updatedAt',
    'description',
    'price',
    'quantity',
    'imageUrl',
];

export const UserAttributesForDetail: (keyof Product)[] = [
    '_id',
    'id',
    'name',
    'createdAt',
    'updatedAt',
    'description',
    'price',
    'quantity',
    'imageUrl',
];
