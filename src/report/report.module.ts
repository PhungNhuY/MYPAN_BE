import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportSchema } from './schema/report.schema';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Report', schema: ReportSchema },
        ]),
    ],
    controllers: [ReportController],
    providers: [ReportService, JwtService]
})
export class ReportModule { }
