import {Schema} from 'mongoose';
import * as bcrypt from 'bcrypt';

export enum EUserStatus {
    inactivated = 'inactivated',
    activated = 'activated',
    locked = 'locked',
    banned = 'banned',
    deleted = 'deleted'
}

export enum EUserRole{
    user = 'user',
    admin = 'admin'
}

export const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, 'Thiếu địa chỉ email'],
            unique: [true, 'Địa chỉ email này đã được đăng ký tài khoản'],
            trim: 'true',
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Địa chỉ email không hợp lệ',
            ],
        },
        username:{
            type: String,
            required: true,
            unique: true,
            match:[
                /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
                'Tên tài khoản không hợp lệ'
            ],
        },
        password: {
            type: String,
            required: [true, 'Thiếu mật khẩu'],
            minLength: [8, 'Mật khẩu phải có ít nhất 8 kí tự'],
            select: false,
        },
        fullname: {
            type: String,
            required: [true, 'Thiếu họ tên'],
            maxLength:[50, 'Họ tên chỉ cho phép tối đa 50 ký tự']
        },
        avatar_link: {
            type: String,
            match: [
                /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/,
                'url không hợp lệ',
            ],
            default: null,
        },
        imageCoverLink: {
            type: String,
            match: [
                /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/,
                'url không hợp lệ',
            ],
            default: null,
        },
        role: {
            type: String,
            enum: {
                values: Object.keys(EUserRole),
                message: 'Không tồn tại quyền \'{VALUE}\'',
            },
            default: EUserRole.user,
        },
        status: {
            type: String,
            enum: {
                values: Object.keys(EUserStatus),
                message: 'Trạng thái \'{VALUE}\' không hợp lệ',
            },
            default: EUserStatus.inactivated,
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.pre('save', async function(next){
    if(this.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(this.password, salt);
        this.password = hashPassword;
    }
    next();
});
