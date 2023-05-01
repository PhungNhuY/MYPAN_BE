import { Schema } from 'mongoose';

export enum ECollectionCategory {
    banner = 'banner',
    normal = 'normal',
    random = 'random',
    season = 'season',
}

export enum ECollectionStatus{
    inactivated = 'inactivated',
    activated = 'activated',
    deleted = 'deleted'
}

export const CollectionSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        imageCoverLink: {
            type: String,
            match: [
                /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/,
                'invalid url',
            ],
        },
        posts: [{
            type: String,
            ref: 'post',
        }],
        category: {
            type: String,
            enum: {
                values: Object.keys(ECollectionCategory),
                message: 'Category {VALUE} is invalid',
            },
            required: true,
        },
        status: {
            type: String,
            enum: {
                values: Object.keys(ECollectionStatus),
                message: 'Status {VALUE} is invalid',
            },
            required: true,
        }
    }
);