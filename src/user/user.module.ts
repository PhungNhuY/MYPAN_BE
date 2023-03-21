import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
    imports:[
        MongooseModule.forFeature([
            {name: 'User', schema: UserSchema}
        ])
    ],
    controllers: [UserController],
    providers: [UserService, JwtService],
    exports: [UserService]
})
export class UserModule {}
