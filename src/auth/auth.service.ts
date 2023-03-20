import { Body, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { IUserResponse } from 'src/user/dto/user-response.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { ICustomResponse, buildSuccessResponse } from 'src/custom-response';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ){}

    async register(createUserData: CreateUserDto): Promise<IUserResponse>{
        return this.userService.create(createUserData);
    }

    async login(loginData: LoginDto):Promise<ICustomResponse>{
        const user = await this.userService.login(loginData);
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
        return buildSuccessResponse({user, accesstoken, refreshToken});
    }
}
