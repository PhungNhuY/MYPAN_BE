import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {

    @UsePipes(new ValidationPipe())
    @Post('register')
    async register(@Body() registerData: RegisterDto){
        return registerData;
    }

    @UsePipes(new ValidationPipe())
    @Post('login')
    @HttpCode(200)
    async login(@Body() loginData: LoginDto){
        return loginData;
    }
}
