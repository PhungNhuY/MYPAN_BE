import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @UsePipes(new ValidationPipe())
    @Post()
    async register(@Body() userData: CreateUserDto) {
        return this.userService.create(userData);
    }
}
