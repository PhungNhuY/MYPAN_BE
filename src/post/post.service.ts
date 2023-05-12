import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPost } from './post.interface';
import { CreatePostDto } from './dtos/create-post.dto';
import { AuthorDto } from './dtos/author.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { IQuery } from 'src/common/interfaces';

@Injectable()
export class PostService {
    constructor(
        @InjectModel('Post') private readonly postModel: Model<IPost>
    ){}

    async find(query: IQuery){
        let q = this.postModel.find({author: query.id});

        // pagination
        const page = query.page || 1;
        const limit = query.perPage || 10;
        const skip = (page - 1) * limit;
        q = q.skip(skip).limit(limit);

        // sort
        const sortBy: string = query.sortBy || '-createdAt';
        q = q.sort(sortBy);

        // count total
        const total = await this.postModel.find({author: query.id}).count();
        const posts = await q;
        return { posts,total};
    }

    async findById(id: string){
        const post = await this.postModel.findById(id).populate('author');
        return post;
    }

    async create(createPostData: CreatePostDto & AuthorDto){
        const newPost = new this.postModel(createPostData);
        return await newPost.save();
    }

    async updateWithAuth(userId: string, postId: string, updatePostData: UpdatePostDto){
        const post = await this.postModel.findOne({_id: postId, author: userId});
        if(!post) throw new NotFoundException();

        // remove undefine property
        Object.keys(updatePostData).forEach(key => updatePostData[key] === undefined && delete updatePostData[key]);

        Object.assign(post, updatePostData);
        
        await post.save({
            validateBeforeSave: true
        });
        return post;
    }

    async delete(userId: string, postId: string){
        const post = await this.postModel.findOneAndDelete({
            author: userId,
            _id: postId,
        });
        return !!post;
    }

    async deleteViolate(postId: string){
        const post = await this.postModel.findByIdAndDelete(postId);
        return !!post;
    }
}
