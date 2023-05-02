import { ECollectionCategory, ECollectionStatus } from '../schema/collection.schema';

export interface UpdateCollectionDto{
    name?: string,
    description?: string;
    imageCoverLink?: string;
    posts?: string;
    category?: ECollectionCategory;
    status?: ECollectionStatus;
}