import { Body, Controller, Get, HttpCode, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthenticationGuard } from 'src/jwt/jwt-authentication.guard';
import { IQuery } from 'src/common/interfaces';
import { ReportService } from './report.service';
import { buildSuccessResponse } from 'src/common/custom-response';
import { ObjectIdValidationPipe } from 'src/common/objectid-validation.pipe';

@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService){}

    @Get()
    @HttpCode(200)
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
}
