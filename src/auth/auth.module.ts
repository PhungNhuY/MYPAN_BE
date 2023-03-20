import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '../jwt/jwt.service';
import { UserModule } from 'src/user/user.module';
import { EmailModule } from 'src/email/email.module';

@Module({
    imports: [UserModule, EmailModule],
    controllers: [AuthController],
    providers: [AuthService, JwtService]
})
export class AuthModule {}
