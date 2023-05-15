import { Document } from 'mongoose';

export interface ISavePost extends Document{
    id: string;
    post: string;
    saveBy: string;
}