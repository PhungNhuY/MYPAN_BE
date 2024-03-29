import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { EmailModule } from './email/email.module';
import { CollectionModule } from './collection/collection.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ReportModule } from './report/report.module';
import { LikeModule } from './like/like.module';
import { SavePostModule } from './save-post/save-post.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRoot(`${process.env.DB_LINK}/${process.env.DB_NAME}`),
        UserModule,
        AuthModule,
        PostModule,
        EmailModule,
        CollectionModule,
        CloudinaryModule,
        ReportModule,
        LikeModule,
        SavePostModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
