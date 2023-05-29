import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FriendRequestService } from './friendRequest.service';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { CreateFriendRequestDto, CreateFriendRequestResultDto, DeleteFriendRequestDto, DeleteFriendRequestResultDto, FriendRequestArrayDto, FriendRequestDto } from './dto/friendRequest.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { FriendRequest } from './schemas/friendRequest.schema';

@Resolver()
export class FriendRequestResolver {
    constructor(
        private readonly FriendRequestService: FriendRequestService
    ) {}

    @Query(() => FriendRequestArrayDto, { name: 'getFriendRequestByRequestUserId'})
    @UseGuards(GqlAuthGuard)
    async getFriendRequestByRequestUserId(
        @CurrentUser() user: UserJwtPayload,
    ): Promise<FriendRequestArrayDto> {
        return await this.FriendRequestService.getFriendRequestsByRequestUserId(user._id);
    }

    @Mutation(() => CreateFriendRequestResultDto, { name: 'createFriendRequest' })
    @UseGuards(GqlAuthGuard)
    async createFriendRequest(
        @CurrentUser() user: UserJwtPayload,
        @Args('createFriendRequestData') reqData: CreateFriendRequestDto
    ): Promise<CreateFriendRequestResultDto> {
        return await this.FriendRequestService.createFriendRequest(user._id, reqData);
    }

    @Mutation(() => DeleteFriendRequestResultDto, { name: 'deleteFriendRequest' })
    @UseGuards(GqlAuthGuard)
    async deleteFriendRequest(
        @CurrentUser() user: UserJwtPayload,
        @Args('deleteFriendRequestData') reqData: DeleteFriendRequestDto
    ): Promise<DeleteFriendRequestResultDto> {
        return await this.FriendRequestService.deleteFriendRequest(reqData);
    }
}
