import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { LikeSchema } from './schema/like.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
    imports:[
        MongooseModule.forFeature([
            {name: 'Like', schema: LikeSchema},
        ]),
    ],
    providers: [LikeService, JwtService],
    controllers: [LikeController],
    exports: [LikeService]
})
export class LikeModule {}
