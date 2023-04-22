import { Schema, SchemaTypes } from 'mongoose';

export const PostSchema = new Schema(
    {
        author:{
            type: SchemaTypes.ObjectId,
            ref: 'User',
        }
    },
    {
        timestamps: true,
    }
);