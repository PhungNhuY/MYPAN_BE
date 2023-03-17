import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<IUser>
    ){}

    async create(createUserData: CreateUserDto):Promise<IUser>{
        try {
            const {email, password, fullname, avatar_link} = createUserData;
            const newUser = new this.userModel({
                email, 
                password,
                fullname,
                avatar_link
            });
            return await newUser.save();
        } catch (error) {
            console.log(error.code);
            const response = {
                statusCode: 400,
                message: [
                    ''
                ],
                error: 'Bad Request'
            };
            throw new HttpException(response, HttpStatus.BAD_REQUEST);
        }
    }
}
