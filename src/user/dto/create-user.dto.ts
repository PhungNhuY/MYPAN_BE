export interface CreateUserDto {
    email: string;
    password: string;
    fullname?: string;
    avatar_link?: string;
}