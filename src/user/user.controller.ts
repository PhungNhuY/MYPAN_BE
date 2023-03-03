import { Body, Controller, HttpException, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @UsePipes(new ValidationPipe())
    @Post()
    async register(@Body() userData: CreateUserDto) {
        return await this.userService.create(userData);
    }

    @UsePipes(new ValidationPipe())
    @Post('login')
    async login(@Body() loginData: LoginUserDto){
        const user = await this.userService.login(loginData);

        if (!user){
            const errors = ['Unauthorize'];
            throw new HttpException({errors}, 401);
        }

        return user;
            
    }
}
