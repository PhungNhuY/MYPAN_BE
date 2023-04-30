import { Document } from 'mongoose';

export interface IPost extends Document{
    id: string;
    author: string;
    name: string;
    description: string;
    imageCoverLink: string;
    ration: number;
    time: number;
    ingredients: [{
        name: string;
        quantity: string;
    }],
    steps: [{
        content: string;
        imageLink: string[];
    }]
}