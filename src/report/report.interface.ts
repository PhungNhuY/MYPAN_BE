import { Document } from 'mongoose';

export interface IReport extends Document{
    id: string;
    post: string;
    numOfReport: number;
}