import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { IUserResponse } from 'src/user/dto/user-response.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
    constructor(
    ){}
}
