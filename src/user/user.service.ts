import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserResponse } from './dto/user-response.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<IUser>
    ){}

    async create(createUserData: CreateUserDto):Promise<IUserResponse>{
        // try {
        const {email, password, fullname, avatar_link} = createUserData;
        const newUser = new this.userModel({
            email, 
            password,
            fullname,
            avatar_link
        });
        return this.buildUserResponse(await newUser.save());
        // } catch (error) {
        //     console.log(error);
        // }
    }

    private buildUserResponse(userData: IUser): IUserResponse{
        const {id, email, fullname, avatar_link, role, status, createdAt, updatedAt} = userData;
        const response: IUserResponse = {
            id,
            email,
            fullname,
            avatar_link,
            role,
            status,
            createdAt,
            updatedAt
        };
        return response;
    }
}
