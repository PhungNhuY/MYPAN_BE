import { BadRequestException } from '@nestjs/common';
import { Schema, Types } from 'mongoose';

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
            required: [true, 'missing collection name'],
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
            ref: 'Post',
        }],
        category: {
            type: String,
            enum: {
                values: Object.keys(ECollectionCategory),
                message: 'Category \'{VALUE}\' is invalid',
            },
            required: [true, 'missing collection category'],
        },
        status: {
            type: String,
            enum: {
                values: Object.keys(ECollectionStatus),
                message: 'Status \'{VALUE}\' is invalid',
            },
            required: [true, 'missing collection status'],
        }
    },
    {
        timestamps: true,
    }
);

CollectionSchema.pre('save', async function(next) {
    // check length
    if(this.posts.length == 0){
        return next(new BadRequestException('Missing posts'));
    }

    // check valid ObjectId
    const ObjectId = Types.ObjectId;
    this.posts.forEach((post) => {
        if (!ObjectId.isValid(post))
            throw new BadRequestException('Invalid postId');
    });

    next();
});