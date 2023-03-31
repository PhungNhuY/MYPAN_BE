import { BadRequestException, Controller, Get } from '@nestjs/common';
import { buildSuccessResponse } from './common/custom-response';

@Controller()
export class AppController {

    @Get()
    getHello(): string {
        return 'Welcome to CookWithMe api';
    }

    @Get('success')
    successResponse(){
        return buildSuccessResponse({});
    }

    @Get('error')
    errorResponse(){
        throw new BadRequestException(['list', 'of', 'error', 'message']);
    }
}
