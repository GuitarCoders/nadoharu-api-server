import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { FriendsQueryResultDto } from './dto/friend.dto';
import { FriendService } from './friend.service';
import { PaginationInput } from 'src/pagination/dto/pagination.dto';

@Resolver()
export class FriendResolver {
    constructor (
        private readonly FriendService: FriendService
    ) {}
    
    @Query(
        () => FriendsQueryResultDto, {
            name: 'friends',
            description: "친구 목록을 가져오는 쿼리입니다."
        })
    @UseGuards(GqlAuthGuard)
    async getFriends(
        @CurrentUser() user: UserJwtPayload,
        @Args('pagination', {description: "페이지네이션 정보"}) 
        pagination: PaginationInput,
        @Args('targetUserId', {nullable: true, description: "친구 목록을 가져올 대상의 user id. 해당 항목을 비우면 로그인한 유저의 id를 기준으로 친구 목록을 불러옵니다."}) 
        targetUserId?: string,
    ):Promise<FriendsQueryResultDto> {
        return await this.FriendService.getFriends(targetUserId ?? user._id, pagination);
    }
}
