import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {

    @MaxLength(64)
    @MinLength(4)
    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @MinLength(8)
    @IsString()
    @IsNotEmpty()
    readonly password: string;
}