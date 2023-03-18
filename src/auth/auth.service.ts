import { Body, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { IUserResponse } from 'src/user/dto/user-response.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService){}

    async register(@Body() createUserData: CreateUserDto): Promise<IUserResponse>{
        return this.userService.create(createUserData);
    }
}
