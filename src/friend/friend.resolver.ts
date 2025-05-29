import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { FriendsDto, FriendsFilterInput, test } from './dto/friend.dto';
import { FriendService } from './friend.service';

@Resolver()
export class FriendResolver {
    constructor (
        private readonly FriendService: FriendService
    ) {}
    
    @Query(() => FriendsDto, {name: 'friends'})
    @UseGuards(GqlAuthGuard)
    async getFriends(
        @CurrentUser() user: UserJwtPayload,
        @Args('filter') filter: FriendsFilterInput 
    ):Promise<FriendsDto> {
        return await this.FriendService.getFriends(user._id, filter);
    }
    

    // ========== Deprecated resolvers ==========
    @Query(() => FriendsDto, {
        name: 'getFriends',
        deprecationReason: '쿼리 명명규칙이 변경됨에 따라 더이상 해당 쿼리는 사용하지 않습니다. friends 쿼리가 해당 쿼리를 완벽히 대체합니다.'
    })
    @UseGuards(GqlAuthGuard)
    async getFriendsDeprecated(
        @CurrentUser() user: UserJwtPayload,
        @Args('filter') filter: FriendsFilterInput 
    ):Promise<FriendsDto> {
        return await this.FriendService.getFriends(user._id, filter);
    }
}
