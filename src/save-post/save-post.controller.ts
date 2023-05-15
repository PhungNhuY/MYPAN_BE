import { Controller, Get, HttpCode, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { SavePostService } from './save-post.service';
import { JwtAuthenticationGuard } from 'src/jwt/jwt-authentication.guard';
import { ObjectIdValidationPipe } from 'src/common/objectid-validation.pipe';
import { buildSuccessResponse } from 'src/common/custom-response';
import { IQuery } from 'src/common/interfaces';

@Controller('save')
export class SavePostController {
    constructor(private readonly savePostService: SavePostService){}

    @Get('/issaved/:postId')
    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    async isSaved(@Req() req, @Param('postId', new ObjectIdValidationPipe())postId: string){
        const isSaved = await this.savePostService.isSaved({
            post: postId,
            saveBy: req.user.id,
        });
        return buildSuccessResponse({isSaved});
    }

    @Post('/unsave/:postId')
    @UseGuards(JwtAuthenticationGuard)
    async unsave(@Req() req, @Param('postId', new ObjectIdValidationPipe()) postId: string){
        const save = await this.savePostService.delete({
            post: postId,
            saveBy: req.user.id,
        });
        return buildSuccessResponse();
    }
    
    @Post(':postId')
    @UseGuards(JwtAuthenticationGuard)
    async save(@Req() req, @Param('postId', new ObjectIdValidationPipe()) postId: string){
        const save = await this.savePostService.create({
            post: postId,
            saveBy: req.user.id,
        });
        return buildSuccessResponse({ save });
    }

    @Get()
    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    async getAllById(@Req() req, @Query() query:IQuery){
        const {savePosts, total} = await this.savePostService.getAllById(req.user.id, query);
        return buildSuccessResponse({savePosts, total});
    }
}
