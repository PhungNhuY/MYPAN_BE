import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { IUserResponse } from 'src/user/dto/user-response.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService
    ){}

    async register(createUserData: CreateUserDto): Promise<IUserResponse>{
        return this.userService.create(createUserData);
    }

    async login(loginData: LoginDto):Promise<IUserResponse>{
        return await this.userService.login(loginData);
    }
}
