import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { buildSuccessResponse } from 'src/common/custom-response';
import { JwtAuthenticationGuard } from 'src/jwt/jwt-authentication.guard';

@Controller('collection')
export class CollectionController {
    constructor(private readonly collectionService: CollectionService){}

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async create(@Req() req, @Body() createCollectionData: CreateCollectionDto) {
        const {
            name,
            description,
            imageCoverLink,
            posts,
            category,
            status
        } = createCollectionData;

        const collection = await this.collectionService.create({
            name,
            description,
            imageCoverLink,
            posts,
            category,
            status
        });

        return buildSuccessResponse({collection});
    }
}
