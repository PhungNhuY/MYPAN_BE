import {Document} from 'mongoose';
export interface IUser extends Document{
    id: string;
    email: string;
    password: string;
    fullname?: string;
    avatar_link?: string;
    role?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}