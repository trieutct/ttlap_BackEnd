import { BaseService } from '@/common/base/base.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import {
    CreateUserDto,
    GetUserListQuery,
    UpdateUserDto,
    loginUserDto,
} from '../user.interface';

import { User } from '@/database/schemas/user.schema';
import { UserRepository } from '../user.repository';
import { UserAttributesForDetail } from '../user.constant';
import { JwtService } from '@nestjs/jwt';
import  {jwtConstants}  from '@/modules/auth/constants';

@Injectable()
export class UserService extends BaseService<User, UserRepository> {
    constructor(private readonly userRepository: UserRepository,private jwtService: JwtService) {
        super(userRepository);
    }

    async createUser(dto: CreateUserDto) {
        try {
            // console.log({...(dto as any)})
            const user: SchemaCreateDocument<User> = {
                ...(dto as any),
            };
            const res= await this.userRepository.createOne(user)
            // console.log(res)
            return res;
        } catch (error) {
            this.logger.error('Error in UserService createUser: ' + error);
            throw error;
        }
    }

    async updateUser(id: Types.ObjectId, dto: UpdateUserDto) {
        try {
            await this.userRepository.updateOneById(id, dto);
            return await this.findUserById(id);
        } catch (error) {
            this.logger.error('Error in UserService updateUser: ' + error);
            throw error;
        }
    }

    async deleteUser(id: Types.ObjectId) {
        try {
            await this.userRepository.softDeleteOne({ _id: id });
            return { id };
        } catch (error) {
            this.logger.error('Error in UserService deleteUser: ' + error);
            throw error;
        }
    }

    async findUserById(
        id: Types.ObjectId,
        attributes: (keyof User)[] = UserAttributesForDetail,
    ) {
        try {
            return await this.userRepository.getOneById(id, attributes);
        } catch (error) {
            this.logger.error('Error in UserService findUserById: ' + error);
            throw error;
        }
    }

    async findAllAndCountUserByQuery(query: GetUserListQuery) {
        try {
            const result =
                await this.userRepository.findAllAndCountUserByQuery(query);
            return result;
        } catch (error) {
            this.logger.error(
                'Error in UserService findAllAndCountUserByQuery: ' + error,
            );
            throw error;
        }
    }


    async loginUser(dto:loginUserDto)
    {
        try{
            const data=await this.userRepository.findOne(dto);
            if(!data)
                return null
            const access_token=await this.jwtService.signAsync({data},{
                secret:jwtConstants.secret,
                expiresIn: jwtConstants.expiresIn,
            });
            return access_token;
        }catch (error) {
            this.logger.error(
                'Error in UserService loginUser: ' + error,
            );
            throw error;
        }
    }
}
