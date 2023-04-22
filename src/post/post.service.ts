import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPost } from './post.interface';
import { CreatePostDto } from './dtos/create-post.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectModel('Post') private readonly postModel: Model<IPost>
    ){}

    async find(){
        const posts = await this.postModel.find().populate('author');
        return posts;
    }

    async create(createPostData: CreatePostDto){
        const {author} = createPostData;
        const newPost = new this.postModel({
            author,
        });
        return await newPost.save();
    }
}
