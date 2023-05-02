import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
    async uploadImage(
        file: Express.Multer.File,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream(
                { folder: 'mypan' },
                (error, result) => {
                    console.error('--->>> cloudinary error: ', error);
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            toStream(file.buffer).pipe(upload);
        });
    }
    
    async uploadImageToCloudinary(file: Express.Multer.File) {
        return await this.uploadImage(file)
            .catch(() => {
                throw new BadRequestException('Có lỗi khi tải ảnh lên, vui lòng thử lại sau');
            });
    }
}
