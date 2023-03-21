export enum statusEnum{
    success = 'success',
    error = 'error'
}
export interface ICustomResponse{
    status: statusEnum,
    error?: string,
    message?: string[],
    data?: object;
}

export function buildSuccessResponse(data: object): ICustomResponse{
    return {
        status: statusEnum.success,
        data
    };
}

export function buildErrorResponse(error: string, message?: string[]): ICustomResponse{
    return {
        status: statusEnum.error,
        error,
        message
    };
}