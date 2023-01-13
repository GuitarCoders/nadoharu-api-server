import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import mongoose, { LeanDocument } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';
import { UserCreateRequest, UserSafe } from './types/user.types';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
    constructor(
        private readonly UserService: UserService
    ) {}

    @Query(() => User, { name: 'userByAccountId'})
    async getUserByAccountId(@Args('id') id: string): Promise<LeanDocument<User>> {
        return await this.UserService.getUserByAccountId(id);
    }

    @Query(() => User, { name: 'userById'})
    async getUserById(@Args('id') id: string): Promise<LeanDocument<User>> {
        return await this.UserService.getUserById(id);
    }

    @Mutation(UserCreateRequest => UserSafe, { name: 'createUser'})
    async createUser(@Args('createUserData') reqUser: UserCreateRequest): Promise<UserSafe> {
        return await this.UserService.createUser(reqUser);
    }
}
