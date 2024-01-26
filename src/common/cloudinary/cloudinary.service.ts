import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import { cloudinaryConfig } from './cloudinary.config';

cloudinary.v2.config(cloudinaryConfig);

@Injectable()
export class CloudinaryService {
    async uploadImage(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream(
                { folder: 'product_NestJS' },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.secure_url);
                    }
                },
            );
            stream.write(file.buffer);
            stream.end();
        });
    }
}
