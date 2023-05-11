import { BadRequestException } from '@nestjs/common';
import { Schema, SchemaTypes, Types } from 'mongoose';

export const ReportSchema = new Schema(
    {
        post:{
            type: SchemaTypes.ObjectId,
            required: [true, 'Thiếu id bài viết'],
            ref: 'Post',
        },
        numOfReport: {
            type: Number,
            required: true,
            default: 1,
        }
    },
    {
        timestamps: true,
    }
);
