import { Schema, SchemaTypes } from 'mongoose';

export const SavePostSchema = new Schema(
    {
        post: {
            type: SchemaTypes.ObjectId,
            required: [true, 'Thiếu postId'],
            ref: 'Post',
        },
        saveBy: {
            type: SchemaTypes.ObjectId,
            required: [true, 'Thiếu userId'],
            ref: 'User',
        },      
    }
);

SavePostSchema.index({post: 1, saveBy: 1}, {unique: true});