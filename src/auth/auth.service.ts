import { Body, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { IUser } from 'src/user/user.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService){}

    async register(@Body() createUserData: CreateUserDto): Promise<IUser>{
        return this.userService.create(createUserData);
    }
}
