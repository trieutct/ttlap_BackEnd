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
    constructor(private readonly userRepository: ProductRepository) {
        super(userRepository);
    }

    async createUser(dto: CreateProductDto) {
        try {
            // console.log({...(dto as any)})
            const user: SchemaCreateDocument<Product> = {
                ...(dto as any),
            };
            const res= await this.userRepository.createOne(user)
            // console.log(res)
            return res;
        } catch (error) {
            this.logger.error('Error in UserService createUser: ' + error);
            throw error;
        }
    }

    async updateUser(id: Types.ObjectId, dto: UpdateProductDto) {
        try {
            await this.userRepository.updateOneById(id, dto);
            return await this.findUserById(id);
        } catch (error) {
            this.logger.error('Error in UserService updateUser: ' + error);
            throw error;
        }
    }

    async deleteUser(id: Types.ObjectId) {
        try {
            await this.userRepository.softDeleteOne({ _id: id });
            return { id };
        } catch (error) {
            this.logger.error('Error in UserService deleteUser: ' + error);
            throw error;
        }
    }

    async findUserById(
        id: Types.ObjectId,
        attributes: (keyof Product)[] = ProductAttributesForList,
    ) {
        try {
            return await this.userRepository.getOneById(id, attributes);
        } catch (error) {
            this.logger.error('Error in UserService findUserById: ' + error);
            throw error;
        }
    }
    async findAllAndCountProductByQuery(query: GetProductListQuery) {
        try {
            const result =
                await this.userRepository.findAllAndCountProductByQuery(query);
            return result;
        } catch (error) {
            this.logger.error(
                'Error in UserService findAllAndCountUserByQuery: ' + error,
            );
            throw error;
        }
    }
}
