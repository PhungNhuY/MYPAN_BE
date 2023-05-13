import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { buildSuccessResponse } from 'src/common/custom-response';
import { JwtAuthenticationGuard } from 'src/jwt/jwt-authentication.guard';
import { ObjectIdValidationPipe } from 'src/common/objectid-validation.pipe';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { ECollectionCategory } from './schema/collection.schema';
import { AdminGuard } from 'src/common/admin.guard';

@Controller('collection')
export class CollectionController {
    constructor(private readonly collectionService: CollectionService){}

    @Post()
    @UseGuards(AdminGuard)
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

    @Get('banner')
    @HttpCode(200)
    async getBanner(){
        const bannerCollection = await this.collectionService.getBanner();
        return buildSuccessResponse({banner: bannerCollection});
    }

    @Get('active')
    @HttpCode(200)
    async getActive(){
        const collections = await this.collectionService.getActiveCollection();
        return buildSuccessResponse({collections});
    }

    @Get()
    @UseGuards(AdminGuard)
    @HttpCode(200)
    async findAll() {
        const collections = await this.collectionService.find();
        return buildSuccessResponse({ collections });
    }

    @Get(':id')
    @HttpCode(200)
    async getOne(
        @Param('id', new ObjectIdValidationPipe()) collectionId: string
    ){
        const collection = await this.collectionService.findById(collectionId);
        if(!collection) throw new NotFoundException();
        return buildSuccessResponse({collection});
    }

    @Patch(':id')
    @HttpCode(200)
    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthenticationGuard)
    async updateOne(
        @Req() req,
        @Param('id', new ObjectIdValidationPipe()) colletionId: string,
        @Body() updateCollectionData: UpdateCollectionDto
    ) {
        const {
            name,
            description,
            category,
            imageCoverLink,
            posts,
            status
        } = updateCollectionData;

        const collection = await this.collectionService.update(
            colletionId,
            {
                name,
                description,
                category,
                imageCoverLink,
                posts,
                status
            }
        );

        if(!collection) throw new NotFoundException();

        return buildSuccessResponse({ collection });
    }

    @Delete(':id')
    @HttpCode(200)
    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthenticationGuard)
    async delete(
        @Req() req,
        @Param('id', new ObjectIdValidationPipe()) collectionId: string
    ){
        const isDeleted = this.collectionService.delete(collectionId);
        if(!isDeleted) throw new NotFoundException();
        return buildSuccessResponse();
    }
}
