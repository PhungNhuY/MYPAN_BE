import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtAuthenticationGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
    ){}

    async canActivate(
        context: ExecutionContext,
    ):Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        const accesstoken = request.cookies['accesstoken'] || request.headers['accesstoken'];
        // console.log(accesstoken);
        
        request.user = await this.jwtService.verifyToken(
            accesstoken, 
            process.env.ACCESS_TOKEN_SECRET
        );
        return true;
    }
}
