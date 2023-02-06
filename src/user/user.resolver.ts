import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import mongoose, { LeanDocument } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';
import { UserCreateRequest, UserSafe } from './models/user.model';
import { UserService } from './user.service';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';

@Resolver()
export class UserResolver {
    constructor(
        private readonly UserService: UserService
    ) {}

    @Query(() => UserSafe, { name: 'userByAccountId'})
    @UseGuards(GqlAuthGuard)
    async getUserByAccountId(@Args('account_id') account_id: string): Promise<UserSafe> {
        return await this.UserService.getUserByAccountIdSafe(account_id);
    }

    @Query(() => UserSafe, { name: 'userById'})
    @UseGuards(GqlAuthGuard)
    async getUserById(@Args('id') id: string): Promise<UserSafe> {
        return await this.UserService.getUserByIdSafe(id);
    }

    @Mutation(() => UserSafe, { name: 'createUser'})
    async createUser(@Args('createUserData') reqUser: UserCreateRequest): Promise<UserSafe> {
        return await this.UserService.createUser(reqUser);
    }
}
