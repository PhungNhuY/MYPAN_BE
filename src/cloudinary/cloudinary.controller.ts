import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { buildSuccessResponse } from 'src/common/custom-response';

@Controller('image')
export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) {}
    
    @Post('upload')
    @UseInterceptors(FileInterceptor('image')) // body -> form-data -> image
    async uploadImage(@UploadedFile() image: Express.Multer.File) {
        const res = await this.cloudinaryService.uploadImageToCloudinary(image);
        return buildSuccessResponse({imageLink: res.secure_url});
    }
}
