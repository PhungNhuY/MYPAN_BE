import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './schema/post.schema';
import { JwtService } from 'src/jwt/jwt.service';
import { LikeModule } from 'src/like/like.module';
import { SavePostModule } from 'src/save-post/save-post.module';
import { ReportModule } from 'src/report/report.module';

@Module({
    imports:[
        MongooseModule.forFeature([
            {name: 'Post', schema: PostSchema},
        ]),
        LikeModule,
        SavePostModule,
    ],
    controllers: [PostController],
    providers: [PostService, JwtService],
    exports: [PostService]
})
export class PostModule {}
