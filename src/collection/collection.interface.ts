import { Document } from 'mongoose';

export interface ICollection extends Document{
    id: string;
    name: string;
    description: string;
    imageCoverLink: string;
    posts: string[];
    category: string;
    status: string;
}