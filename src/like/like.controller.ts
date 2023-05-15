import { Controller, Get, HttpCode, Param, Post, Req, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthenticationGuard } from 'src/jwt/jwt-authentication.guard';
import { ObjectIdValidationPipe } from 'src/common/objectid-validation.pipe';
import { buildErrorResponse, buildSuccessResponse } from 'src/common/custom-response';

@Controller('like')
export class LikeController {
    constructor(private readonly likeService: LikeService){}

    @Get('/count/:postId')
    @HttpCode(200)
    async countInPost(@Param('postId', new ObjectIdValidationPipe())postId: string){
        const numOfLike = await this.likeService.countInPost(postId);
        return buildSuccessResponse({numOfLike});
    }

    @Get('/isliked/:postId')
    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    async isLiked(@Req() req, @Param('postId', new ObjectIdValidationPipe())postId: string){
        const isLiked = await this.likeService.isLiked({
            post: postId,
            likeBy: req.user.id,
        });
        return buildSuccessResponse({isLiked});
    }

    @Post('/unlike/:postId')
    @UseGuards(JwtAuthenticationGuard)
    async unlike(@Req() req, @Param('postId', new ObjectIdValidationPipe()) postId: string){
        const like = await this.likeService.delete({
            post: postId,
            likeBy: req.user.id,
        });
        return buildSuccessResponse();
    }

    @Post(':postId')
    @UseGuards(JwtAuthenticationGuard)
    async like(@Req() req, @Param('postId', new ObjectIdValidationPipe()) postId: string){
        const like = await this.likeService.create({
            post: postId,
            likeBy: req.user.id,
        });
        return buildSuccessResponse({ like });
    }


}
