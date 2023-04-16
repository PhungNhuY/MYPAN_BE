import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto{
    @IsOptional()
    @IsEmail()
    @IsNotEmpty()
        email?: string;

    @IsOptional()
    @MinLength(8)
    @IsString()
    @IsNotEmpty()
        password?: string;

    @IsOptional()
        fullname?: string;

    @IsOptional()
        avatar_link?: string;
}