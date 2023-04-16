import {Schema} from 'mongoose';
import * as bcrypt from 'bcrypt';

export enum EUserStatus {
    inactivated = 'inactivated',
    activated = 'activated',
    locked = 'locked',
    banned = 'banned',
    deleted = 'deleted'
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
        // otp:{
        //     type: String,
        //     select: false,
        // },
        fullname: {
            type: String,
            // required: [true, "missing fullname"],
            default: 'default name',
        },
        avatar_link: {
            type: String,
            // default: '/images/default_avatar.png',
            default: null,
        },
        role: {
            type: String,
            enum: {
                values: ['user', 'admin'],
                message: 'Role {VALUE} is invalid',
            },
            default: 'user',
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

// UserSchema.methods.matchPassword = async function(password){
//     return await bcrypt.compare(password, this.password);
// };