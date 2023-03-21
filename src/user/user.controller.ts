import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthenticationGuard } from 'src/jwt/jwt-authentication.guard';
import { UserService } from './user.service';
import { buildSuccessResponse } from 'src/common/custom-response';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService){}

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    async getMe(@Req() req){
        const user = await this.userService.findOne({_id: req.user.id});
        return buildSuccessResponse({user});
    }
}
