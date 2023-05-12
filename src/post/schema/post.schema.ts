import { Schema, SchemaTypes } from 'mongoose';
import { removeVietnameseTones } from 'src/common/language-handle';

export const PostSchema = new Schema(
    {
        author:{
            type: SchemaTypes.ObjectId,
            required: [true, 'Thiếu author_id'],
            ref: 'User',
        },
        name: {
            type: String,
            required: [true, 'Thiếu tên món ăn'],
            maxLength: 1000,
        },
        nameForSearch: {
            type: String,
        },
        description:{
            type: String,
            maxLength: 1000,
        },
        imageCoverLink:{
            type: String,
            match: [
                /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/,
                'url không hợp lệ',
            ],
        },
        ration:{
            type: Number,
            min: [1, 'Số khảu phần ăn không được nhỏ hơn 1'],
            max: [10, 'Số khảu phần ăn không được lớn hơn 10'],
        },
        time: {
            type: Number,
            min: [1, 'Thời gian nấu ít nhất là 1 phút'],
            max: [43200, 'Thời gian nấu không được vượt quá 43200 phút'],
        },
        ingredients:{
            type: [{
                _id: false,
                name: {
                    type: String,
                    required: [true, 'Nguyên liệu cần phải có nội dung'],
                },
                quantity: {
                    type: String,
                }
            }],
            validate: [IngreLimit, 'Tối đa 100 nguyên liệu'],
        },
        steps:[{
            _id: false,
            content:{
                type: String,
                required: [true, 'Mỗi bước cần phải có nội dung'],
                maxLength: [10000, 'Nội dung bước quá dài, tối đa 1000 ký tự'],
            },
            imageLink:{
                type: [{
                    type: String,
                    match: [
                        /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/,
                        'url không hợp lệ',
                    ]
                }],
                validate: [ImageEachStepLimit, 'Tối đa 3 ảnh minh họa cho một bước'],
            },
        }],
    },
    {
        timestamps: true,
    }
);

function ImageEachStepLimit(val) {
    return val.length <= 3;
}

function IngreLimit(val) {
    return val.length <= 100;
}

PostSchema.pre('save', async function(next) {
    if(this.isModified('name')){
        this.nameForSearch = removeVietnameseTones(this.name);
    }
    next();
});

PostSchema.index({author: 1, name: 1}, {unique: true});