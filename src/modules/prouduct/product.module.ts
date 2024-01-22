import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { ProductRepository } from './product.repository';
import { Product,ProductSchema } from '@/database/schemas/product.schema';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
        MulterModule.register({
            dest: '@/data', // Đường dẫn lưu trữ file
          }),
    ],
    controllers: [ProductController],
    providers: [ProductService, ProductRepository],
    exports: [ProductRepository],
})
export class ProductModule {}
