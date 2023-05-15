import { Document } from 'mongoose';

export interface ILike extends Document{
    id: string;
    post: string;
    likeBy: string;
}