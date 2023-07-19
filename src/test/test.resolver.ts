import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { FriendService } from 'src/friend/friend.service';
import { UserService } from 'src/user/user.service';
import { result } from './test.dto';

@Resolver()
export class TestResolver {
    constructor (
        private readonly friendService: FriendService,
        private readonly userService: UserService
    ) {}

    @Mutation(() => result)
    @UseGuards(GqlAuthGuard)
    async addAllUserInFriend(
        @CurrentUser() user: UserJwtPayload,
    ): Promise<result> {
        const allUserDocuments = await this.userService.getAllUsers();

        const filteredUserDocuments = allUserDocuments.filter(item => (user._id !== item._id.toString()));

        const addFriendPromises = filteredUserDocuments.map( userDoc => {
            return this.friendService.addFriend(user._id, userDoc._id.toString());
        })
        await Promise.all(addFriendPromises);

        return {success: true}
    }
}
