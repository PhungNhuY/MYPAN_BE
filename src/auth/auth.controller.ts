import { Body, Controller, HttpCode, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { buildSuccessResponse } from 'src/common/custom-response';
import { Response } from 'express';
import { JwtService } from 'src/jwt/jwt.service';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
    ){}

    @UsePipes(new ValidationPipe())
    @Post('register')
    async register(@Body() registerData: CreateUserDto){
        return buildSuccessResponse(await this.authService.register(registerData));
    }

    @UsePipes(new ValidationPipe())
    @Post('login')
    @HttpCode(200)
    async login(@Body() loginData: LoginDto, @Res({ passthrough: true }) res: Response){
        const user = await this.authService.login(loginData);
        const payload = {
            id: user.id,
            email: user.email,
        };
        const accesstoken = 
            await this.jwtService.generateToken(
                payload, 
                process.env.ACCESS_TOKEN_SECRET, 
                process.env.ACCESS_TOKEN_LIFE,
            );
        const refreshToken = 
            await this.jwtService.generateToken(
                payload,
                process.env.REFRESH_TOKEN_SECRET,
                process.env.REFRESH_TOKEN_LIFE
            );

        res
            .cookie('access-token', accesstoken, {
                httpOnly: true,
                expires: new Date(253402300799999), // Fri Dec 31 9999 23:59:59 GMT+0000
            })
            .cookie('refresh-token', refreshToken, {
                httpOnly: true,
                expires: new Date(253402300799999), // Fri Dec 31 9999 23:59:59 GMT+0000
                path: '/auth/refresh',
            })
        ;
        return buildSuccessResponse({user, accesstoken, refreshToken});
    }
}
