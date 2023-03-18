import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto{
    @IsEmail()
    @IsNotEmpty()
        email: string;

    @MinLength(8)
    @IsString()
    @IsNotEmpty()
        password: string;

    fullname?: string;
    avatar_link?: string;
}