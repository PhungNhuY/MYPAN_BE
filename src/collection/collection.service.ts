import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICollection } from './collection.interface';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { ECollectionCategory, ECollectionStatus } from './schema/collection.schema';

@Injectable()
export class CollectionService {
    constructor(
        @InjectModel('Collection') private readonly collectionModel: Model<ICollection>
    ){}

    async create(createCollectionData: CreateCollectionDto) {
        const newCollection = new this.collectionModel(createCollectionData);
        return await newCollection.save();
    }

    async find(query?: any){
        const collections = await this.collectionModel.find()
            .sort({createdAt: -1}).populate({
                path: 'posts',
                select: { 'author': 1, 'name': 1, 'imageCoverLink': 1, 'description': 1},
                populate:[
                    {
                        path: 'author',
                        select: { 'fullname': 1, 'avatar_link': 1, 'username': 1},
                    },
                ],
            })
        ;
        return collections; 
    }

    async getBanner(){
        const banner = await this.collectionModel.findOne({
            category: ECollectionCategory.banner,
            status: ECollectionStatus.activated,
        }).sort({createdAt: -1}).populate({
            path: 'posts',
            select: { 'author': 1, 'name': 1, 'imageCoverLink': 1, 'description': 1},
            populate:[
                {
                    path: 'author',
                    select: { 'fullname': 1, 'avatar_link': 1, 'username': 1},
                },
            ],
        });
        return banner;
    }

    async getActiveCollection(){
        const banner = await this.collectionModel.find({
            // category: ECollectionCategory.banner,
            $or: [{category: ECollectionCategory.normal,}, {category: ECollectionCategory.season,}],
            status: ECollectionStatus.activated,
        }).sort({createdAt: -1}).populate({
            path: 'posts',
            select: { 'author': 1, 'name': 1, 'imageCoverLink': 1, 'description': 1},
            populate:[
                {
                    path: 'author',
                    select: { 'fullname': 1, 'avatar_link': 1, 'username': 1},
                },
            ],
        });
        return banner;
    }

    async findById(id: string){
        // const collection = await this.collectionModel.findById(id).populate('posts', 'author name imageCoverLink');
        const collection = await this.collectionModel.findById(id).populate({
            path: 'posts',
            select: { 'author': 1, 'name': 1, 'imageCoverLink': 1},
            populate:[
                {
                    path: 'author',
                    select: { 'fullname': 1, 'avatar_link': 1, 'username': 1},
                },
            ],
        });
        return collection;
    }

    async update(collectionId: string, updateCollectionData: UpdateCollectionDto){
        // to use pre('save') middleware, we use find and save instead of findOneAndUpdate
        const collection = await this.collectionModel.findById(collectionId);
        if (!collection) throw new NotFoundException();
        
        // remove undefine property
        Object.keys(updateCollectionData).forEach(key => updateCollectionData[key] === undefined && delete updateCollectionData[key]);
        
        Object.assign(collection, updateCollectionData);
        
        await collection.save();
        return collection;
    }

    async delete(collectionId: string){
        const colletion = await this.collectionModel.findOneAndDelete({
            _id: collectionId,
        });
        return !!colletion;
    }
}
