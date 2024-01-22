import { BaseService } from '@/common/base/base.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import {
    CreateProductDto,
    GetProductListQuery,
    UpdateProductDto,
} from '../product.interface';

import { Product } from '@/database/schemas/product.schema';
import { ProductRepository } from '../product.repository';
import { ProductAttributesForList } from '../product.contant';

@Injectable()
export class ProductService extends BaseService<Product, ProductRepository> {
    constructor(private readonly productRepository: ProductRepository) {
        super(productRepository);
    }

    async createProduct(dto: CreateProductDto) {
        try {
            // console.log({...(dto as any)})
            const product: SchemaCreateDocument<Product> = {
                ...(dto as any),
            };
            const res= await this.productRepository.createOne(product)
            // console.log(res)
            return res;
        } catch (error) {
            this.logger.error('Error in productService createproduct: ' + error);
            throw error;
        }
    }

    async updateProduct(id: Types.ObjectId, dto: UpdateProductDto) {
        try {
            await this.productRepository.updateOneById(id, dto);
            return await this.findProductById(id);
        } catch (error) {
            this.logger.error('Error in ProductService updateProduct: ' + error);
            throw error;
        }
    }

    async deleteProduct(id: Types.ObjectId) {
        try {
            await this.productRepository.softDeleteOne({ _id: id });
            return { id };
        } catch (error) {
            this.logger.error('Error in ProductService deleteProduct: ' + error);
            throw error;
        }
    }

    async findProductById(
        id: Types.ObjectId,
        attributes: (keyof Product)[] = ProductAttributesForList,
    ) {
        try {
            return await this.productRepository.getOneById(id, attributes);
        } catch (error) {
            this.logger.error('Error in ProductService findProductById: ' + error);
            throw error;
        }
    }
    async findAllAndCountProductByQuery(query: GetProductListQuery) {
        try {
            const result =
                await this.productRepository.findAllAndCountProductByQuery(query);
            return result;
        } catch (error) {
            this.logger.error(
                'Error in ProductService findAllAndCountProductByQuery: ' + error,
            );
            throw error;
        }
    }
}
