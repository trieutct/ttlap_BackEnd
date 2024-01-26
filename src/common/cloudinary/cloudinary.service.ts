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
    async deleteImage(url: string): Promise<void> {
        const publicId = this.getPublicIdFromUrl(url);
        return new Promise((resolve, reject) => {
            cloudinary.v2.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }
    private getPublicIdFromUrl(imageUrl: string): string | null {
        const regex = /\/([^/]+?)\.(?:jpg|jpeg|png|gif|webp|svg)/;
        const match = imageUrl.match(regex);
        return match ? match[1] : null;
    }
}
