import { Body, Controller, Get, HttpCode, Post, Query, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { buildSuccessResponse } from 'src/common/custom-response';
import { Response } from 'express';
import { JwtService } from 'src/jwt/jwt.service';
import { EmailService } from 'src/email/email.service';
import { UserService } from 'src/user/user.service';
import { EUserStatus } from 'src/user/schema/user.schema';
import { IPayload } from './interfaces';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly mailService: EmailService
    ){}

    @Post('register')
    async register(@Body() registerData: CreateUserDto){
        const user = await this.userService.create(registerData);

        // gen token
        const payload: IPayload = {
            id: user.id,
            email: user.email,
        };
        const confirmtoken = 
            await this.jwtService.generateToken(
                payload, 
                process.env.CONFIRM_TOKEN_SECRET, 
                process.env.CONFIRM_TOKEN_LIFE,
            );

        // send mail
        await this.mailService.sendUserConfirmation(user.email, confirmtoken);

        return buildSuccessResponse({user});
    }

    @Post('login')
    @HttpCode(200)
    async login(@Body() loginData: LoginDto){
        
        const user = await this.userService.login(loginData);
        const payload: IPayload = {
            id: user.id,
            email: user.email,
        };
        const accesstoken = 
            await this.jwtService.generateToken(
                payload, 
                process.env.ACCESS_TOKEN_SECRET, 
                process.env.ACCESS_TOKEN_LIFE,
            );
        const refreshtoken = 
            await this.jwtService.generateToken(
                payload,
                process.env.REFRESH_TOKEN_SECRET,
                process.env.REFRESH_TOKEN_LIFE
            );

        return buildSuccessResponse({user, accesstoken, refreshtoken});
    }

    @Get('confirm')
    @HttpCode(200)
    async confirm(@Query('token') token: string){
        const payload = await this.jwtService.verifyToken(
            token,
            process.env.CONFIRM_TOKEN_SECRET
        ) as IPayload;

        // update user status to activate
        const user = await this.userService.updateStatusById(payload.id, EUserStatus.activated);
        
        return buildSuccessResponse(user);
    }

}
