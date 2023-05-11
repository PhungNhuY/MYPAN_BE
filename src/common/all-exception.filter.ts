import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { buildErrorResponse } from './custom-response';
  
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

        console.log('--->>>exception filter');
        console.log(exception);

        if(exception instanceof HttpException){
            httpStatus = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if(typeof exceptionResponse == 'string'){
                responseBody = buildErrorResponse(exceptionResponse);
            }else if(typeof exceptionResponse == 'object'){
                responseBody = {
                    status: 'error',
                    ...exceptionResponse
                };
            }
        }
        
        else if(exception.name == 'ValidationError'){
            httpStatus = HttpStatus.BAD_REQUEST;
            responseBody = buildErrorResponse(
                // 'Validation Error',
                'Lỗi: ',
                Object.values(exception.errors).map((e: any) => e.message)
            );
        }

        else if(exception.name == 'JsonWebTokenError' || exception.name == 'TokenExpiredError'){
            httpStatus = HttpStatus.UNAUTHORIZED;
            // responseBody = buildErrorResponse('Unauthorized');
            responseBody = buildErrorResponse('Không được xác thực');
        }

        else if(exception.code == 11000){
            httpStatus = HttpStatus.BAD_REQUEST;
            responseBody = buildErrorResponse(
                // 'duplicate value',
                // Object.keys(exception.keyValue).map(e => `${e} has been duplicated`)
                'Trùng dữ liệu',
                Object.keys(exception.keyValue).map(e => `${e} đã tồn tại`)
            );
        }
        
        else if(exception.name == 'CastError'){
            httpStatus = HttpStatus.BAD_REQUEST;
            responseBody = buildErrorResponse(
                'CastError',
                ['Dữ liệu không hợp lệ']
            );
        }

        else {
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
            responseBody = buildErrorResponse('Internal server error');
        }
  
        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}