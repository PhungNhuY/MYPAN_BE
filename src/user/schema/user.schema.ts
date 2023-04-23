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
            required: [true, 'missing email address'],
            unique: [true, 'email already exsits'],
            trim: 'true',
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'email is invalid',
            ],
        },
        password: {
            type: String,
            required: [true, 'missing password'],
            minLength: [8, 'password too short'],
            select: false,
        },
        fullname: {
            type: String,
            required: [true, 'missing fullname'],
            default: 'default name',
        },
        avatar_link: {
            type: String,
            match: [
                /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/,
                'invalid url',
            ],
            default: null,
        },
        role: {
            type: String,
            enum: {
                values: Object.keys(EUserRole),
                message: 'Role {VALUE} is invalid',
            },
            default: EUserRole.user,
        },
        status: {
            type: String,
            enum: {
                values: Object.keys(EUserStatus),
                message: 'Status {VALUE} is invalid',
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
