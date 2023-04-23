import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './schema/post.schema';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
    imports:[
        MongooseModule.forFeature([
            {name: 'Post', schema: PostSchema},
        ]),
    ],
    controllers: [PostController],
    providers: [PostService, JwtService]
})
export class PostModule {}
