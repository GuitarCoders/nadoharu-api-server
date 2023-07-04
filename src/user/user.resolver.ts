import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import mongoose, { LeanDocument } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';
import { UserCreateRequestDto, UserDeleteRequestDto, UserDeleteResultDto, UserSafeDto, UserUpdateRequestDto, UserUpdateResultDto, UsersSafeDto, getFriendDto } from './dto/user.dto';
import { UserService } from './user.service';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { CurrentUser } from 'src/auth/auth-user.decorator';

@Resolver()
export class UserResolver {
    constructor(
        private readonly UserService: UserService
    ) {}

    @Query(() => UserSafeDto, { name: 'userByAccountId'})
    @UseGuards(GqlAuthGuard)
    async getUserByAccountId(@Args('account_id') account_id: string): Promise<UserSafeDto> {
        return await this.UserService.getUserByAccountIdSafe(account_id);
    }

    @Query(() => UserSafeDto, { name: 'userById'})
    @UseGuards(GqlAuthGuard)
    async getUserById(@Args('id') id: string): Promise<UserSafeDto> {
        return await this.UserService.getUserByIdSafe(id);
    }

    @Query(() => UserSafeDto, { name: 'userWhoAmI'})
    @UseGuards(GqlAuthGuard)
    async getUserWhoAmI(@CurrentUser() user: UserJwtPayload): Promise<UserSafeDto> {
        return await this.UserService.getUserByIdSafe(user._id);
    }

    @Mutation(() => UserUpdateResultDto, { name: 'updateUser'})
    @UseGuards(GqlAuthGuard)
    async updateUser(
        @CurrentUser() user: UserJwtPayload,
        @Args('updateUserData') reqUser: UserUpdateRequestDto
    ): Promise<UserUpdateResultDto> {
        return await this.UserService.updateUserById(user._id, reqUser);
    }

    @Mutation(() => UserSafeDto, { name: 'createUser'})
    async createUser(@Args('createUserData') reqUser: UserCreateRequestDto): Promise<UserSafeDto> {
        return await this.UserService.createUser(reqUser);
    }

    @Mutation(() => UserDeleteResultDto, { name: 'deleteUser'})
    @UseGuards(GqlAuthGuard)
    async deleteUser(
        @CurrentUser() user: UserJwtPayload,
        @Args('deleteUserData') deleteConfirm: UserDeleteRequestDto
    ): Promise<UserDeleteResultDto> {
        return await this.UserService.deleteUser(user._id, deleteConfirm);
    }

    @Mutation(() => UsersSafeDto, { name: 'getFriends'})
    @UseGuards(GqlAuthGuard)
    async getFriends(
        @CurrentUser() user: UserJwtPayload,
        @Args('getFriendsData', {nullable: true}) reqData?: getFriendDto
    ): Promise<UsersSafeDto> {
        if(reqData) {
            return await this.UserService.getFriends(reqData.targetUserId);
        } else {
            return await this.UserService.getFriends(user._id)
        }
    }

}
