import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthenticationGuard } from 'src/jwt/jwt-authentication.guard';
import { buildSuccessResponse } from 'src/common/custom-response';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { ObjectIdValidationPipe } from 'src/common/objectid-validation.pipe';
import { IQuery } from 'src/common/interfaces';
import { ReportService } from 'src/report/report.service';
import { LikeService } from 'src/like/like.service';
import { SavePostService } from 'src/save-post/save-post.service';

@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly likeService: LikeService,
        private readonly savePostService: SavePostService,
    ) { }
    
    @Get('list')
    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    async findAll(@Req() req, @Query() query:IQuery) {
        query.id = req.user.id;
        const {posts, total} = await this.postService.find(query);
        return buildSuccessResponse({ posts, total });
    }

    // get list of post with author id, use in profile page
    @Get('list/:id')
    @HttpCode(200)
    async findAllById(@Param('id', new ObjectIdValidationPipe()) id: string, @Query() query:IQuery) {
        // this is authorId
        query.id = id;
        const {posts, total} = await this.postService.find(query);
        return buildSuccessResponse({ posts, total });
    }

    @Get('search/:text')
    @HttpCode(200)
    async search(@Param('text') text: string, @Query() query:IQuery){
        const {posts, total} = await this.postService.search(text, query);
        return buildSuccessResponse({posts, total});
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
        const post = await this.postService.delete(req.user.id, postId);
        if(!post) throw new NotFoundException('Món ăn không tồn tại');
        this.likeService.deleteByPostId(post._id);
        this.savePostService.deleteByPostId(post._id);
        return buildSuccessResponse();
    }
}
