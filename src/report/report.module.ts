import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportSchema } from './schema/report.schema';
import { JwtService } from 'src/jwt/jwt.service';
import { PostModule } from 'src/post/post.module';
import { EmailModule } from 'src/email/email.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Report', schema: ReportSchema },
        ]),
        PostModule,
        EmailModule,
    ],
    controllers: [ReportController],
    providers: [ReportService, JwtService],
    exports: [ReportService],
})
export class ReportModule { }
