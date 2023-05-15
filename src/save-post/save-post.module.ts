import { Module } from '@nestjs/common';
import { SavePostService } from './save-post.service';
import { SavePostController } from './save-post.controller';
import { JwtService } from 'src/jwt/jwt.service';
import { SavePostSchema } from './schema/save-post.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports:[
        MongooseModule.forFeature([
            {name: 'SavePost', schema: SavePostSchema},
        ]),
    ],
    providers: [SavePostService, JwtService],
    controllers: [SavePostController]
})
export class SavePostModule {}
