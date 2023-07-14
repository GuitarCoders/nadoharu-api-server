import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { UsersSafeDto } from 'src/user/dto/user.dto';
import { test } from './dto/friend.dto';
import { FriendService } from './friend.service';

@Resolver()
export class FriendResolver {
    constructor (
        private readonly FriendService: FriendService
    ) {}

    @Query(() => UsersSafeDto, {name: 'getFriends'})
    @UseGuards(GqlAuthGuard)
    async getFriends(
        @CurrentUser() user: UserJwtPayload
    ):Promise<UsersSafeDto> {
        return await this.FriendService.getFriends(user._id);
    }
}
