import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICollection } from './collection.interface';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionService {
    constructor(
        @InjectModel('Collection') private readonly collectionModel: Model<ICollection>
    ){}

    async create(createCollectionData: CreateCollectionDto) {
        const newCollection = new this.collectionModel(createCollectionData);
        return await newCollection.save();
    }

    async find(){
        const collections = await this.collectionModel.find();
        return collections; 
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
