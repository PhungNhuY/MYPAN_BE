import { Body, Controller, Get, HttpCode, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthenticationGuard } from 'src/jwt/jwt-authentication.guard';
import { buildSuccessResponse } from 'src/common/custom-response';
import { CreatePostDto } from './dtos/create-post.dto';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Get()
    @HttpCode(200)
    async findAll() {
        const posts = await this.postService.find();
        return buildSuccessResponse({ posts });
    }

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async create(@Req() req, @Body() createPostData: CreatePostDto) {
        const { 
            name,
            description,
            imageCoverLink,
            ration,
            time,
            ingredients,
            steps 
        } = createPostData;
        const post = await this.postService.create({
            author: req.user.id,
            name,
            description,
            imageCoverLink,
            ration,
            time,
            ingredients,
            steps
        });
        return buildSuccessResponse({ post });
    }
}
