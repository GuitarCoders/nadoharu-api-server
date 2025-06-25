import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import mongoose, { LeanDocument } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';
import { UserCreateRequestDto, UserDeleteRequestDto, UserDeleteResultDto, UserSafeDto, UserUpdatePasswordRequestDto, UserUpdateRequestDto, UserUpdateResultDto, UsersSafeDto } from './dto/user.dto';
import { UserService } from './user.service';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { CurrentUser } from 'src/auth/auth-user.decorator';

@Resolver()
export class UserResolver {
    constructor(
        private readonly UserService: UserService
    ) {}

    @Query(() => UserSafeDto, { 
        name: 'userByAccountId',
        description: "accoundId에 해당하는 유저의 정보를 가져오는 쿼리입니다. 상세한 정보 (친구 수, 친구여부 등)을 가져오려면 userInfoByAccoundId를 사용하십시오."
    })
    @UseGuards(GqlAuthGuard)
    async getUserByAccountId(
        @Args('account_id', {
            description: "가져올 유저의 accountId"
        }) account_id: string
    ): Promise<UserSafeDto> {
        return await this.UserService.getUserByAccountIdSafe(account_id);
    }

    @Query(() => UserSafeDto, {
        name: 'userById',
        description: "user id에 해당하는 유저의 정보를 가져오는 쿼리입니다. 상세한 정보 (친구 수, 친구여부 등)을 가져오려면 userInfo 쿼리를 사용하십시오."
    })
    @UseGuards(GqlAuthGuard)
    async getUserById(
        @Args('id', {
            description: "가져올 유저의 고유 id"
        }) id: string
    ): Promise<UserSafeDto> {
        return await this.UserService.getUserByIdSafe(id);
    }

    @Query(() => UserSafeDto, { 
        name: 'userWhoAmI',
        description: "로그인한 유저의 정보를 가져오는 쿼리입니다. 상세한 정보 (친구 수, 친구여부 등)을 가져오려면 userInfo 쿼리를 사용하십시오."
    })
    @UseGuards(GqlAuthGuard)
    async getUserWhoAmI(@CurrentUser() user: UserJwtPayload): Promise<UserSafeDto> {
        return await this.UserService.getUserByIdSafe(user._id);
    }

    @Query(() => UsersSafeDto, {
        name: 'users',
        description: "검색어를 통해 검색된 유저 목록을 가져오는 쿼리입니다. 검색어는 유저의 name(유저가 지정한 닉네임), accound_id(유저의 계정 아이디)를 검색합니다. 한국어 검색은 자모 분리를 고려하지 않습니다."
    })
    @UseGuards(GqlAuthGuard)
    async getUsers(
        @CurrentUser() user: UserJwtPayload,
        @Args('search',
            {description: "검색 문자열."}
        ) search: string
    ): Promise<UsersSafeDto> {
        return await this.UserService.findUsers(search);
    }

    @Mutation(() => UserUpdateResultDto, { 
        name: 'updateUser',
        description: "로그인한 유저의 정보를 변경하는 뮤테이션입니다."
    })
    @UseGuards(GqlAuthGuard)
    async updateUser(
        @CurrentUser() user: UserJwtPayload,
        @Args('updateUserData', {
            description: "바꿀 정보 Input객체"
        }) reqUser: UserUpdateRequestDto
    ): Promise<UserUpdateResultDto> {
        return await this.UserService.updateUserById(user._id, reqUser);
    }

    @Mutation(() => UserSafeDto, {
        name: 'createUser',
        description: "새 유저를 생성하는 뮤테이션입니다."
    })
    async createUser(
        @Args('createUserData', {
            description: "새로운 유저에 대한 정보 Input객체"
        }) reqUser: UserCreateRequestDto
    ): Promise<UserSafeDto> {
        return await this.UserService.createUser(reqUser);
    }

    @Mutation(() => UserDeleteResultDto, {
        name: 'deleteUser',
        description: "로그인한 유저의 데이터를 삭제하는 뮤테이션입니다. 삭제한 유저는 데이터베이스 상에서 영구삭제되며 다시 접근할 수 없습니다. 하지만 해당 유저가 남긴 글, 댓글 등은 남아있습니다."
    })
    @UseGuards(GqlAuthGuard)
    async deleteUser(
        @CurrentUser() user: UserJwtPayload,
        @Args('deleteUserData', {
            description: "정말로 삭제할 것인지의 여부를 묻는 input객체"
        }) deleteConfirm: UserDeleteRequestDto
    ): Promise<UserDeleteResultDto> {
        return await this.UserService.deleteUser(user._id, deleteConfirm);
    }

}
