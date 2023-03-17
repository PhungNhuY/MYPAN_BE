import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthenticationGuard } from 'src/jwt/jwt-authentication.guard';

@Controller('user')
export class UserController {

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    async getMe(@Req() req){
        return 'the data';
    }
}
