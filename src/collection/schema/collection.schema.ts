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
            required: [true, 'Thiếu tên bộ sưu tập'],
        },
        description: {
            type: String,
        },
        imageCoverLink: {
            type: String,
            match: [
                /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/,
                'url không hợp lệ',
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
                message: 'Phân loại \'{VALUE}\' không hợp lệ',
            },
            required: [true, 'Thiếu phân loại'],
        },
        status: {
            type: String,
            enum: {
                values: Object.keys(ECollectionStatus),
                message: 'Trạng thái \'{VALUE}\' không hợp lệ',
            },
            required: [true, 'Thiếu trang thái bộ sưu tập'],
        }
    },
    {
        timestamps: true,
    }
);

CollectionSchema.pre('save', async function(next) {
    // check length
    if(this.posts.length == 0){
        return next(new BadRequestException('Cần có ít nhất 1 bài viết'));
    }

    // check valid ObjectId
    const ObjectId = Types.ObjectId;
    this.posts.forEach((post) => {
        if (!ObjectId.isValid(post))
            throw new BadRequestException('Id bài viết không hợp lệ');
    });

    next();
});