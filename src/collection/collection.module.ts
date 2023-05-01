import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionSchema } from './schema/collection.schema';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'Collection', schema: CollectionSchema},
        ]),
    ],
    controllers: [CollectionController],
    providers: [CollectionService, JwtService]
})
export class CollectionModule {}
