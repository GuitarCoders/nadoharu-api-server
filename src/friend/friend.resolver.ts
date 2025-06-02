import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { FriendsDto, FriendsQueryResultDto, test } from './dto/friend.dto';
import { FriendService } from './friend.service';
import { PaginationInput } from 'src/pagination/dto/pagination.dto';

@Resolver()
export class FriendResolver {
    constructor (
        private readonly FriendService: FriendService
    ) {}
    
    @Query(() => FriendsQueryResultDto, {name: 'friends'})
    @UseGuards(GqlAuthGuard)
    async getFriends(
        @CurrentUser() user: UserJwtPayload,
        @Args('pagination') pagination: PaginationInput,
        @Args('targetUserId', {nullable: true}) targetUserId?: string,
    ):Promise<FriendsQueryResultDto> {
        return await this.FriendService.getFriends(targetUserId ?? user._id, pagination);
    }
}
