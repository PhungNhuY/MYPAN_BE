import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISavePost } from './save-post.interface';
import { SavePostDto } from './dto/save-post.dto';
import { IQuery } from 'src/common/interfaces';

@Injectable()
export class SavePostService {
    constructor(
        @InjectModel('SavePost') private readonly savePostModel: Model<ISavePost>
    ){}

    async create(createSavePostData: SavePostDto){
        const newSavePost = new this.savePostModel(createSavePostData);
        return await newSavePost.save();
    }

    async delete(deleteSavePostData: SavePostDto){
        const savePost = await this.savePostModel.findOneAndDelete({
            post: deleteSavePostData.post,
            saveBy: deleteSavePostData.saveBy,
        });
        return !!savePost;
    }

    async isSaved(savePostData: SavePostDto){
        const savePost = await this.savePostModel.findOne({
            post: savePostData.post,
            saveBy: savePostData.saveBy,
        });
        return !!savePost;
    }

    async getAllById(userId: string, query: IQuery){
        let q = this.savePostModel.find({saveBy: userId});

        // pagination
        const page = query.page || 1;
        const limit = query.perPage || 10;
        const skip = (page - 1) * limit;
        q = q.skip(skip).limit(limit);

        // sort
        const sortBy: string = query.sortBy || '-createdAt';
        q = q.sort(sortBy);

        // count total
        const total = await this.savePostModel.find({saveBy: userId}).count();

        const savePosts = await q.populate({
            path: 'post',
            select: { 'author': 1, 'name': 1, 'imageCoverLink': 1, 'description': 1},
            populate:[
                {
                    path: 'author',
                    select: { 'fullname': 1, 'avatar_link': 1, 'username': 1},
                },
            ],
        });

        return {savePosts, total};
    }

    async deleteByPostId(postId: string){
        await this.savePostModel.deleteMany({post: postId});
    }
}
