import { BadRequestException, Body, Controller, Get, HttpCode, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthenticationGuard } from 'src/jwt/jwt-authentication.guard';
import { UserService } from './user.service';
import { buildSuccessResponse } from 'src/common/custom-response';
import { ObjectIdValidationPipe } from 'src/common/objectid-validation.pipe';
import { UpdateUserDto } from './dto/update-user.dto';

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

    @Patch()
    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    async updateProfile(
        @Req() req,
        @Body() updateUserData: UpdateUserDto
    ){
        const{
            username,
            email,
            avatar_link,
            fullname,
            password,
            status
        } = updateUserData;

        const user = await this.userService.updateWithAuth(
            req.user.id,
            {
                username,
                email,
                avatar_link,
                fullname,
                password,
                status
            }
        );

        if(!user) throw new BadRequestException();

        return buildSuccessResponse({user});
    }
}
