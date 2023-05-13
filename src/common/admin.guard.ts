import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {

    async canActivate(
        context: ExecutionContext,
    ):Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        console.log(request.user);
        
        return (request.user.role == 'admin');
    }
}
