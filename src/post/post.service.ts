import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPost } from './post.interface';
import { CreatePostDto } from './dtos/create-post.dto';
import { AuthorDto } from './dtos/author.dto';
import { UpdatePostDto } from './dtos/update-post.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectModel('Post') private readonly postModel: Model<IPost>
    ){}

    async find(){
        const posts = await this.postModel.find().populate('author');
        return posts;
    }

    async findById(id: string){
        const post = await this.postModel.findById(id);
        return post;
    }

    async create(createPostData: CreatePostDto & AuthorDto){
        const newPost = new this.postModel(createPostData);
        return await newPost.save();
    }

    async updateWithAuth(userId: string, postId: string, updatePostData: UpdatePostDto){
        const post = await this.postModel.findOneAndUpdate(
            {
                author: userId,
                _id: postId,
            },
            {
                ...updatePostData,
            },
            {
                new: true,
                runValidators: true,
            }
        );
        return post;
    }

    async delete(userId: string, postId: string){
        const post = await this.postModel.findOneAndDelete({
            author: userId,
            _id: postId,
        });
        return !!post;
    }
}
