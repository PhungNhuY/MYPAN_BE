export interface CreateUserDto {
    email: string;
    username: string;
    password: string;
    fullname?: string;
    avatar_link?: string;
}