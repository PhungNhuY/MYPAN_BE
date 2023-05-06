import {Document} from 'mongoose';
export interface IUser extends Document{
    id: string;
    email: string;
    username: string;
    password: string;
    fullname?: string;
    avatar_link?: string;
    imageCoverLink?: string;
    role?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}