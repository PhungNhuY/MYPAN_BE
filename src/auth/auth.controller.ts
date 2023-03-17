import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @UsePipes(new ValidationPipe())
    @Post('register')
    async register(@Body() registerData: CreateUserDto){
        return this.authService.register(registerData);
    }

    @UsePipes(new ValidationPipe())
    @Post('login')
    @HttpCode(200)
    async login(@Body() loginData: LoginDto){
        return loginData;
    }
}
