import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto{
    @IsString()
    @IsNotEmpty()
        author: string;
}