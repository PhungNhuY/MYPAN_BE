import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { EmailModule } from './email/email.module';
import { CollectionModule } from './collection/collection.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.DB_LINK),
        UserModule,
        AuthModule,
        PostModule,
        EmailModule,
        CollectionModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
