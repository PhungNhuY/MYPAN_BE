import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICollection } from './collection.interface';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Injectable()
export class CollectionService {
    constructor(
        @InjectModel('Collection') private readonly collectionModel: Model<ICollection>
    ){}

    async create(createCollectionData: CreateCollectionDto) {
        const newCollection = new this.collectionModel(createCollectionData);
        return await newCollection.save();
    }
}
