import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FriendRequestService } from './friendRequest.service';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { AcceptFriendRequestDto, AcceptFriendRequestResultDto, CreateFriendRequestDto, CreateFriendRequestResultDto, DeleteFriendRequestDto, DeleteFriendRequestResultDto, FriendRequestArrayDto, FriendRequestDto } from './dto/friendRequest.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { FriendRequest } from './schemas/friendRequest.schema';

@Resolver()
export class FriendRequestResolver {
    constructor(
        private readonly FriendRequestService: FriendRequestService
    ) {}

    /**
    * @deprecated The method should not be used
    */
    @Query(() => FriendRequestArrayDto, {
        name: 'getSentFriendRequests',
        deprecationReason: '쿼리 명명규칙이 변경됨에 따라 더이상 해당 쿼리는 사용하지 않습니다. sentFriendRequests 쿼리가 해당 쿼리를 완벽히 대체합니다.'
    })
    @UseGuards(GqlAuthGuard)
    async getSentFriendRequestsDeprecated(
        @CurrentUser() user: UserJwtPayload,
    ): Promise<FriendRequestArrayDto> {
        return await this.FriendRequestService.getFriendRequestsByRequestUserId(user._id);
    }

    @Query(() => FriendRequestArrayDto, { name: 'sentFriendRequests'})
    @UseGuards(GqlAuthGuard)
    async getSentFriendRequests(
        @CurrentUser() user: UserJwtPayload,
    ): Promise<FriendRequestArrayDto> {
        return await this.FriendRequestService.getFriendRequestsByRequestUserId(user._id);
    }

    /**
    * @deprecated Deprecated due to naming mistake. Use `getRecievedFriendRequests()`
    */
    @Query(() => FriendRequestArrayDto, { 
        name: 'getReceiveFriendRequests', 
        deprecationReason: '쿼리 이름에 오타가 있습니다. receivedFriendRequests가 해당 쿼리를 완벽히 대체합니다.'}
    )
    @UseGuards(GqlAuthGuard)
    async getReceiveFriendRequests(
        @CurrentUser() user: UserJwtPayload,
    ): Promise<FriendRequestArrayDto> {
        return await this.FriendRequestService.getFriendRequestsByReceiveUserId(user._id);
    }

    @Query(() => FriendRequestArrayDto, { name: 'receivedFriendRequests'})
    @UseGuards(GqlAuthGuard)
    async getReceivedFriendRequests(
        @CurrentUser() user: UserJwtPayload,
    ): Promise<FriendRequestArrayDto> {
        return await this.FriendRequestService.getFriendRequestsByReceiveUserId(user._id);
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

    @Mutation(() => AcceptFriendRequestResultDto, { name: 'acceptFriendRequest' })
    @UseGuards(GqlAuthGuard)
    async acceptFriendRequest(
        @CurrentUser() user: UserJwtPayload,
        @Args('acceptFriendRequestData') reqData: AcceptFriendRequestDto
    ): Promise<AcceptFriendRequestResultDto> {
        return await this.FriendRequestService.acceptFriendRequest(user._id, reqData);
    }
}
