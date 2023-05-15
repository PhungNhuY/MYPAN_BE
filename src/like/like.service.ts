import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ILike } from './like.interface';
import { Model } from 'mongoose';
import { LikeDto } from './dto/like.dto';

@Injectable()
export class LikeService {
    constructor(
        @InjectModel('Like') private readonly likeModel: Model<ILike>
    ){}

    async create(createLikeData: LikeDto){
        const newLike = new this.likeModel(createLikeData);
        return await newLike.save();
    }

    async delete(deleteLikeData: LikeDto){
        const like = await this.likeModel.findOneAndDelete({
            post: deleteLikeData.post,
            likeBy: deleteLikeData.likeBy,
        });
        return !!like;
    }

    async isLiked(likeData: LikeDto){
        const like = await this.likeModel.findOne({
            post: likeData.post,
            likeBy: likeData.likeBy,
        });
        return !!like;
    }

    async countInPost(postId: string){
        const numOfLike = await this.likeModel.find({post: postId}).count();
        return numOfLike;
    }

    async deleteByPostId(postId: string){
        await this.likeModel.deleteMany({post: postId});
    }
}
