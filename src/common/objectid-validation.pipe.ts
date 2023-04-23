import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
    transform(value: string) {
        const ObjectId = Types.ObjectId;
        if (!ObjectId.isValid(value)) throw new BadRequestException();
        return value;
    }
}
