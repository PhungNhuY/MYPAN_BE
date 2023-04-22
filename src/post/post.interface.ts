import { Document } from 'mongoose';

export interface IPost extends Document{
    id: string;
    author: string;
}