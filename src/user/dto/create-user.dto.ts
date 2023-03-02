import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @MaxLength(64)
    @MinLength(4)
    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @MaxLength(128)
    @MinLength(8)
    @IsString()
    @IsNotEmpty()
    password: string;
}
