import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { ProductRepository } from './product.repository';
import { Product, ProductSchema } from '../../database/schemas/product.schema';
// import { MulterModule } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
        ]),
        // MulterModule.register({
        //     storage: diskStorage({
        //         destination: './data',
        //         filename: (req, file, callback) => {
        //             callback(
        //                 null,
        //                 `${file.fieldname}-${Date.now()}-${file.originalname}`,
        //             );
        //         },
        //     }),
        //     fileFilter: (req, file, callback) => {
        //         if (file.mimetype.startsWith('image/')) {
        //             callback(null, true);
        //         } else {
        //             callback(new Error('Not an image file'), false);
        //         }
        //     },
        // }),
    ],
    controllers: [ProductController],
    providers: [ProductService, ProductRepository],
    exports: [ProductRepository],
})
export class ProductModule {}
