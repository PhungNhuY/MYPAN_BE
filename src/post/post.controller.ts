import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthenticationGuard } from 'src/jwt/jwt-authentication.guard';
import { buildSuccessResponse } from 'src/common/custom-response';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { ObjectIdValidationPipe } from 'src/common/objectid-validation.pipe';
import { IQuery } from 'src/common/interfaces';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }
    
    @Get('list')
    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    async findAll(@Req() req, @Query() query:IQuery) {
        query.id = req.user.id;
        const {posts, total} = await this.postService.find(query);
        return buildSuccessResponse({ posts, total });
    }

    @Get('list/:id')
    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    async findAllById(@Req() req, @Query() query:IQuery) {
        query.id = req.user.id;
        const posts = await this.postService.find(query);
        return buildSuccessResponse({ posts });
    }
    
    @Get(':id')
    @HttpCode(200)
    async getOne(
        @Param('id', new ObjectIdValidationPipe()) postId: string
    ){
        const post = await this.postService.findById(postId);
        if(!post) throw new NotFoundException();
        return buildSuccessResponse({post});
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

    @Patch(':id')
    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    async updateOne(
        @Req() req,
        @Param('id', new ObjectIdValidationPipe()) postId: string,
        @Body() updatePostData: UpdatePostDto
    ) {
        const {
            name,
            description,
            imageCoverLink,
            ingredients,
            ration,
            steps,
            time
        } = updatePostData;
        const post = await this.postService.updateWithAuth(
            req.user.id,
            postId,
            {
                name,
                description,
                imageCoverLink,
                ingredients,
                ration,
                steps,
                time
            }
        );

        if(!post) throw new NotFoundException();

        return buildSuccessResponse({ post });
    }
    

    @Delete(':id')
    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    async delete(
        @Req() req,
        @Param('id', new ObjectIdValidationPipe()) postId: string
    ){
        const isDeleted = this.postService.delete(req.user.id, postId);
        if(!isDeleted) throw new NotFoundException();
        return buildSuccessResponse();
    }
}
