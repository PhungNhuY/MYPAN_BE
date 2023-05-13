import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthenticationGuard } from 'src/jwt/jwt-authentication.guard';
import { IQuery } from 'src/common/interfaces';
import { ReportService } from './report.service';
import { buildSuccessResponse } from 'src/common/custom-response';
import { ObjectIdValidationPipe } from 'src/common/objectid-validation.pipe';
import { PostService } from 'src/post/post.service';
import { EmailService } from 'src/email/email.service';
import { AdminGuard } from 'src/common/admin.guard';

@Controller('report')
export class ReportController {
    constructor(
        private readonly reportService: ReportService,
        private readonly postService: PostService,
        private readonly emailService: EmailService
    ){}

    @Get()
    @HttpCode(200)
    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthenticationGuard)
    async findAll(@Query() query: IQuery){
        const {reports, total} = await this.reportService.find(query);
        return buildSuccessResponse({reports, total});
    }

    @Post(':id')
    @UseGuards(JwtAuthenticationGuard)
    async create(
        @Req() req, 
        @Param('id', new ObjectIdValidationPipe()) postId: string,
    ){
        const post = await this.postService.findById(postId);
        if(!post) throw new BadRequestException('Bài viết không tồn tại');
        const report = await this.reportService.findByPostId(postId);
        if(!report){
            // if not exists -> create new
            await this.reportService.create(postId);
        }else{
            // if exists numOfReport+1
            report.numOfReport++;
            await report.save();
        }
        return buildSuccessResponse();
    }

    // when post no violate just delete report
    @Get('noViolate/:id')
    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthenticationGuard)
    async noViolate(
        @Param('id', new ObjectIdValidationPipe()) reportId: string
    ){
        await this.reportService.delete(reportId);
        return buildSuccessResponse();
    }

    // when post violate delete report, post, send mail to user
    @Get('violate/:id')
    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthenticationGuard)
    async violate(
        @Param('id', new ObjectIdValidationPipe()) reportId: string
    ){
        // delete report
        const report = await this.reportService.delete(reportId);

        // get post
        const post: any = await this.postService.findById(report.post);

        // delete post
        const deleted = await this.postService.deleteViolate(report.post);

        //send mail
        // send mail
        await this.emailService.sendViolationWarning(post.author.email, post.author.name, post.name);

        return buildSuccessResponse();
    }
}
