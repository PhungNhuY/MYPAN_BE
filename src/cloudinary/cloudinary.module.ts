import { Module } from '@nestjs/common';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';
@Module({
    controllers: [CloudinaryController],
    providers: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
