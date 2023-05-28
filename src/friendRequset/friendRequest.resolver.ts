import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FriendRequestService } from './friendRequest.service';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { CreateFriendRequestDto, CreateFriendResultDto, Test } from './dto/friendRequest.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';

@Resolver()
export class FriendRequestResolver {
    constructor(
        private readonly FriendRequestService: FriendRequestService
    ) {}

    @Mutation(() => CreateFriendResultDto, { name: 'createFriendRequest' })
    @UseGuards(GqlAuthGuard)
    async createFriendRequest(
        @CurrentUser() user: UserJwtPayload,
        @Args('createFriendRequestData') reqData: CreateFriendRequestDto
    ): Promise<CreateFriendResultDto> {
        return await this.FriendRequestService.createFriendRequest(reqData);
    }
}
