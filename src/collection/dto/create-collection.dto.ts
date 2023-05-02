import { ECollectionCategory, ECollectionStatus } from '../schema/collection.schema';

export interface CreateCollectionDto {
    name: string;
    description?: string;
    imageCoverLink?: string;
    posts: string;
    category: ECollectionCategory;
    status: ECollectionStatus;
}