import { Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthenticationGuard } from 'src/jwt/jwt-authentication.guard';
import { buildSuccessResponse } from 'src/common/custom-response';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService){}

    @Get()
    @HttpCode(200)
    async findAll(){
        const posts = await this.postService.find();
        return buildSuccessResponse({posts}); 
    }

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async create(@Req() req){
        const post = await this.postService.create({
            author: req.user.id
        });
        return buildSuccessResponse({post});
    }
}
