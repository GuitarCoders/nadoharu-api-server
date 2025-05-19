import { Args, Query, Resolver } from "@nestjs/graphql";
import { AboutMeDto, UserInfoDto, UserInfosDto } from "./dto/userInfo.dto";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "src/auth/gql-auth.guard";
import { UserJwtPayload } from "src/auth/models/auth.model";
import { UserInfoService } from "./userInfo.service";
import { CurrentUser } from "src/auth/auth-user.decorator";


@Resolver()
export class UserInfoResolver {
    constructor(
        private readonly UserInfoService: UserInfoService
    ) {}

    @Query(() => UserInfoDto, { name: 'userInfo'})
    @UseGuards(GqlAuthGuard)
    async getUserInfo(
        @CurrentUser() user: UserJwtPayload,
        @Args('userId') userId: string
    ): Promise<UserInfoDto> {
        return this.UserInfoService.getUserInfo(user._id, userId);
    }

    @Query(() => UserInfosDto, { name: 'userInfos'})
    @UseGuards(GqlAuthGuard)
    async getUserInfos(
        @CurrentUser() user: UserJwtPayload,
        @Args('search') search: string
    ): Promise<UserInfosDto> {
        return this.UserInfoService.getUserInfos(user._id, search);
    }

    @Query(() => AboutMeDto, { name: 'me'})
    @UseGuards(GqlAuthGuard)
    async getTokenOwnerUserInfo(
        @CurrentUser() user: UserJwtPayload
    ): Promise<AboutMeDto> {
        return this.UserInfoService.getUserInfoAboutMe(user._id);
    }

    @Query(() => UserInfoDto, { name: 'userInfoByAccountId'})
    @UseGuards(GqlAuthGuard)
    async getUserInfoByAccountId(
        @CurrentUser() user: UserJwtPayload,
        @Args('accountId') accountId: string 
    ): Promise<UserInfoDto> {
        return this.UserInfoService.getUserInfoByAccountId(user._id, accountId);
    }
}