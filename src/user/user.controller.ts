import { Controller, Get, HttpCode, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthenticationGuard } from 'src/jwt/jwt-authentication.guard';
import { UserService } from './user.service';
import { buildSuccessResponse } from 'src/common/custom-response';
import { ObjectIdValidationPipe } from 'src/common/objectid-validation.pipe';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService){}

    @Get()
    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    async getMe(@Req() req){
        const user = await this.userService.findOne({_id: req.user.id});
        return buildSuccessResponse({user});
    }

    @Get(':id')
    @HttpCode(200)
    async getUser(
        @Param('id', new ObjectIdValidationPipe()) userId: string,
    ){
        const user = await this.userService.findOne({_id: userId});
        return buildSuccessResponse({user});
    }
}
