import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity, UserRole } from './user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private dataSource: DataSource
    ) { }

    async create(createUserData: CreateUserDto): Promise<UserEntity> {
        // check username/email
        const user = await this.dataSource.getMongoRepository(UserEntity).findOne({
            where: {
                $or: [
                    { username: createUserData.username },
                    { email: createUserData.email }
                ]
            }
        });

        if (user) {
            const error = new Array<string>();
            if (user.email == createUserData.email) error.push('Email has been duplicated');
            if (user.username == createUserData.username) error.push('Username has been duplicated');
            throw new HttpException(
                { message: 'BAD_REQUEST', error },
                HttpStatus.BAD_REQUEST
            );
        }

        // create new user
        const newUser = new UserEntity();
        newUser.username = createUserData.username;
        newUser.email = createUserData.email;
        newUser.password = createUserData.password;

        const error = await validate(newUser);
        if (error.length > 0) {
            throw new HttpException(
                { message: 'BAD_REQUEST' },
                HttpStatus.BAD_REQUEST,
            );
        } else {
            const savedUser = await this.userRepository.save(newUser);
            return savedUser;
        }
    }

    async login(loginData: LoginUserDto): Promise<UserEntity>{
        const user = await this.userRepository.findOne({
            where:{
                email: loginData.email
            }
        });

        if(!user) return null;

        const comparePassword = await bcrypt.compare(loginData.password, user.password);
        if(comparePassword){
            return user;
        }

        return null;
    }
}
