import { Schema, SchemaTypes } from 'mongoose';

export const LikeSchema = new Schema(
    {
        post: {
            type: SchemaTypes.ObjectId,
            required: [true, 'Thiếu postId'],
            ref: 'Post',
        },
        likeBy: {
            type: SchemaTypes.ObjectId,
            required: [true, 'Thiếu userId'],
            ref: 'User',
        },      
    }
);

LikeSchema.index({post: 1, likeBy: 1}, {unique: true});