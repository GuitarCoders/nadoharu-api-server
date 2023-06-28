import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import mongoose, { LeanDocument } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';
import { UserCreateRequest, UserDeleteRequest, UserDeleteResult, UserSafe, UserUpdateRequest, UserUpdateResult } from './models/user.model';
import { UserService } from './user.service';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { CurrentUser } from 'src/auth/auth-user.decorator';

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

    @Query(() => UserSafe, { name: 'userWhoAmI'})
    @UseGuards(GqlAuthGuard)
    async getUserWhoAmI(@CurrentUser() user: UserJwtPayload): Promise<UserSafe> {
        return await this.UserService.getUserByIdSafe(user._id);
    }

    @Mutation(() => UserUpdateResult, { name: 'updateUser'})
    @UseGuards(GqlAuthGuard)
    async updateUser(
        @CurrentUser() user: UserJwtPayload,
        @Args('updateUserData') reqUser: UserUpdateRequest
    ): Promise<UserUpdateResult> {
        return await this.UserService.updateUserById(user._id, reqUser);
    }

    @Mutation(() => UserSafe, { name: 'createUser'})
    async createUser(@Args('createUserData') reqUser: UserCreateRequest): Promise<UserSafe> {
        return await this.UserService.createUser(reqUser);
    }

    @Mutation(() => UserDeleteResult, { name: 'deleteUser'})
    @UseGuards(GqlAuthGuard)
    async deleteUser(
        @CurrentUser() user: UserJwtPayload,
        @Args('deleteUserData') deleteConfirm: UserDeleteRequest
    ): Promise<UserDeleteResult> {
        return await this.UserService.deleteUser(user._id, deleteConfirm);
    }
}
