import { Schema, SchemaTypes } from 'mongoose';

export const PostSchema = new Schema(
    {
        author:{
            type: SchemaTypes.ObjectId,
            required: [true, 'missing author id'],
            ref: 'User',
        },
        name: {
            type: String,
            required: [true, 'missing name'],
            maxLength: 1000,
        },
        description:{
            type: String,
            maxLength: 1000,
        },
        imageCoverLink:{
            type: String,
            match: [
                /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/,
                'invalid url',
            ],
        },
        ration:{
            type: Number,
            min: [1, 'min 1 ration'],
            max: [10, 'max 10 ration'],
        },
        time: {
            type: Number,
            min: [1, 'min 1 minute'],
            max: [43200, 'max 43200 minute'],
        },
        ingredients:[{
            type: String,
        }],
        steps:[{
            content:{
                type: String,
                required: true,
                maxLength: [10000, 'step too long'],
            },
            imageLink:{
                type: String,
                match: [
                    /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/,
                    'invalid url',
                ],
            }
        }],
    },
    {
        timestamps: true,
    }
);

PostSchema.index({author: 1, name: 1}, {unique: true});