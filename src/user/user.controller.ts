import { Controller, Get, Req } from '@nestjs/common';

@Controller('user')
export class UserController {

    @Get()
    async getMe(@Req() req){
        return 'the data';
    }
}
