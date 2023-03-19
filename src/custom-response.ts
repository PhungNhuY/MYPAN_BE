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

export function buildSuccessResponse(data): ICustomResponse{
    return {
        status: statusEnum.success,
        data
    };
}