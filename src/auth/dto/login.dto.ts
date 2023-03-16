import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto{
    @IsString()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;
}