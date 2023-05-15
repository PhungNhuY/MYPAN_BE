import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IReport } from './report.interface';
import { Model } from 'mongoose';
import { IQuery } from 'src/common/interfaces';
import { CreateReportDto } from './dtos/create-report.dto';

@Injectable()
export class ReportService {
    constructor(
        @InjectModel('Report') private readonly reportModel: Model<IReport>
    ){}
    
    async find(query: IQuery){
        let q = this.reportModel.find();

        // pagination
        const page = query.page || 1;
        const limit = query.perPage || 10;
        const skip = (page - 1) * limit;
        q = q.skip(skip).limit(limit);

        // sort
        const sortBy: string = query.sortBy || '-createdAt';
        q = q.sort(sortBy);

        // count total
        const total = await this.reportModel.find().count();
        const reports = await q.populate({
            path: 'post',
            select: { 'author': 1, 'name': 1, 'imageCoverLink': 1, 'description': 1, 'createdAt': 1},
            populate:[
                {
                    path: 'author',
                    select: { 'fullname': 1, 'avatar_link': 1, 'username': 1},
                },
            ],
        });
        return { reports, total};
    }

    async findByPostId(postId: string){
        const report = await this.reportModel.findOne({post: postId});
        return report;
    }

    async create(postId: string){
        const newReport = new this.reportModel({post: postId});
        return await newReport.save();
    }

    async delete(reportId: string): Promise<IReport>{
        const report = await this.reportModel.findByIdAndDelete(reportId);
        return report;
    }

    async deleteByPostId(postId: string){
        await this.reportModel.deleteMany({post: postId});
    }
}
