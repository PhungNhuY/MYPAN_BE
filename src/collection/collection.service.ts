import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICollection } from './collection.interface';

@Injectable()
export class CollectionService {
    constructor(
        @InjectModel('Collection') private readonly collectionModel: Model<ICollection>
    ){}
}
