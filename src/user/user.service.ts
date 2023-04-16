import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserResponse } from './dto/user-response.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import {compare} from 'bcrypt';
import { EUserStatus } from './schema/user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<IUser>
    ){}

    async findOne(option: object){
        const user = await this.userModel.findOne(option);
        return this.buildUserResponse(user);
    }

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

    async login(loginData: LoginDto):Promise<IUserResponse>{
        // find user in database
        const user = await this.userModel.findOne({ email: loginData.email }).select('+password');
        if(!user) throw new BadRequestException(['user name or password does not match']);

        // compare password
        const isMatch = await compare(loginData.password, user.password);
        if(!isMatch) throw new BadRequestException(['user name or password does not match']);

        return this.buildUserResponse(user);
    }

    async updateStatusById(id: string, status: EUserStatus){
        const user = await this.userModel.findByIdAndUpdate(
            id, 
            {status},
            { new: true, runValidators: true}
        );

        return this.buildUserResponse(user);
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
