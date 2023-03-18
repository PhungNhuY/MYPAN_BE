import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
  
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  
    catch(exception: any, host: ArgumentsHost): void {
        // In certain situations `httpAdapter` might not be available in the
        // constructor method, thus we should resolve it here.
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        let httpStatus;
        let responseBody;
  
        // let httpStatus =
        // exception instanceof HttpException
        //     ? exception.getStatus()
        //     : HttpStatus.INTERNAL_SERVER_ERROR;
  
        // let responseBody = {
        //     status: 'error',
        //     message: '',
        //     error: exception.
        // };

        if(exception instanceof HttpException){
            httpStatus = exception.getStatus();
            responseBody = {
                status: 'error',
                message: exception.getResponse(),
            };
        }
        
        else if(exception.name == 'ValidationError'){
            httpStatus = HttpStatus.BAD_REQUEST;
            responseBody = {
                status: 'error',
                message: 'Validation Error',
                error: Object.values(exception.errors).map((e: any) => e.message)
            };
        }

        else if(exception.code == 11000){
            httpStatus = HttpStatus.BAD_REQUEST;
            responseBody = {
                status: 'error',
                message: 'duplicate value',
                error: Object.keys(exception.keyValue).map(e => `${e} has been duplicated`)
            };
        }

        else {
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
            responseBody = {
                status: 'error',
                message: 'Internal server error'
            };
        }
  
        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}