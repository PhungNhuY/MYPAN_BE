import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserResponse } from './dto/user-response.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import {compare} from 'bcrypt';
import { EUserStatus } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

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
        const {
            email, 
            username, 
            password, 
            fullname, 
            avatar_link,
            imageCoverLink,
        } = createUserData;
        const newUser = new this.userModel({
            email, 
            username,
            password,
            fullname,
            avatar_link,
            imageCoverLink,
        });
        return this.buildUserResponse(await newUser.save());
    }

    async login(loginData: LoginDto):Promise<IUserResponse>{
        // find user in database
        const user = await this.userModel.findOne({ email: loginData.email }).select('+password');
        if(!user) throw new BadRequestException(['Tên tài khoản hoặc mật khẩu không đúng']);

        // compare password
        const isMatch = await compare(loginData.password, user.password);
        if(!isMatch) throw new BadRequestException(['Tên tài khoản hoặc mật khẩu không đúng']);

        // check active account
        if(user.status != EUserStatus.activated){
            throw new BadRequestException(['Bạn cần xác nhận địa chỉ email trước khi đăng nhập']);
        }

        return this.buildUserResponse(user);
    }

    async changePassword(userId: string, oldPass: string, newPass: string){
        // find user in database
        const user = await this.userModel.findOne({ _id: userId }).select('+password');
        if(!user) throw new BadRequestException();
        
        // compare password
        const isMatch = await compare(oldPass, user.password);
        if(!isMatch) throw new BadRequestException(['Mật khẩu không đúng']);

        user.password = newPass;
        await user.save();
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

    async updateWithAuth(userId: string, updateUserData:UpdateUserDto){
        const user = await this.userModel.findById(userId);
        if(!user) throw new NotFoundException();

        // remove undefine property
        Object.keys(updateUserData).forEach(key => updateUserData[key] === undefined && delete updateUserData[key]);

        Object.assign(user, updateUserData);

        await user.save({
            validateBeforeSave: true,
        });
        return user;
    }

    private buildUserResponse(userData: IUser): IUserResponse{
        const { 
            id,
            email,
            username,
            fullname,
            avatar_link,
            imageCoverLink,
            role,
            status,
            createdAt,
            updatedAt 
        } = userData;
        const response: IUserResponse = {
            id,
            email,
            username,
            fullname,
            avatar_link,
            imageCoverLink,
            role,
            status,
            createdAt,
            updatedAt
        };
        return response;
    }
}
