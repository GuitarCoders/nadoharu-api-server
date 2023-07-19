import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { FriendsDto, getFriendsDto, test } from './dto/friend.dto';
import { FriendService } from './friend.service';

@Resolver()
export class FriendResolver {
    constructor (
        private readonly FriendService: FriendService
    ) {}

    @Query(() => FriendsDto, {name: 'getFriends'})
    @UseGuards(GqlAuthGuard)
    async getFriends(
        @CurrentUser() user: UserJwtPayload,
        @Args('filter') filter: getFriendsDto 
    ):Promise<FriendsDto> {
        return await this.FriendService.getFriends(user._id, filter);
    }
}
