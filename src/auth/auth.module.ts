import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '../jwt/jwt.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtService]
})
export class AuthModule {}
