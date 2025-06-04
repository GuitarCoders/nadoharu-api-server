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

    @Query(() => UserInfoDto, { 
        name: 'userInfo',
        description: "특정 id를 가진 유저의 상세한 정보를 가져오는 쿼리입니다."
    })
    @UseGuards(GqlAuthGuard)
    async getUserInfo(
        @CurrentUser() user: UserJwtPayload,
        @Args('userId', {
            description: "가져올 유저의 고유 id"
        }) userId: string
    ): Promise<UserInfoDto> {
        return this.UserInfoService.getUserInfo(user._id, userId);
    }

    @Query(() => UserInfosDto, { 
        name: 'userInfos',
        description: "특정 검색어 만족하는 유저 상세정보 목록을 가져오는 쿼리입니다. 검색어는 유저의 name(유저가 지정한 닉네임), accound_id(유저의 계정 아이디)를 검색합니다. 한국어 검색은 자모 분리를 고려하지 않습니다."
    })
    @UseGuards(GqlAuthGuard)
    async getUserInfos(
        @CurrentUser() user: UserJwtPayload,
        @Args('search', {
            description: "검색 문자열"
        }) search: string
    ): Promise<UserInfosDto> {
        return this.UserInfoService.getUserInfos(user._id, search);
    }

    @Query(() => AboutMeDto, { 
        name: 'me',
        description: "로그인한 유저의 상세정보를 가져오는 쿼리입니다."
    })
    @UseGuards(GqlAuthGuard)
    async getTokenOwnerUserInfo(
        @CurrentUser() user: UserJwtPayload
    ): Promise<AboutMeDto> {
        return this.UserInfoService.getUserInfoAboutMe(user._id);
    }

    @Query(() => UserInfoDto, { 
        name: 'userInfoByAccountId',
        description: "account_id에 해당하는 유저의 상세정보를 가져오는 쿼리입니다."
    })
    @UseGuards(GqlAuthGuard)
    async getUserInfoByAccountId(
        @CurrentUser() user: UserJwtPayload,
        @Args('accountId', 
            {description: "상세정보를 가져올 유저의 account_id"}
        ) accountId: string 
    ): Promise<UserInfoDto> {
        return this.UserInfoService.getUserInfoByAccountId(user._id, accountId);
    }
}