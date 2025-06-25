import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FriendRequestService } from './friendRequest.service';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { AcceptFriendRequestResultDto, CreateFriendRequestDto, CreateFriendRequestResultDto, DeleteFriendRequestResultDto, FriendRequestsQueryResultDto} from './dto/friendRequest.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { PaginationInput } from 'src/pagination/dto/pagination.dto';

@Resolver()
export class FriendRequestResolver {
    constructor(
        private readonly FriendRequestService: FriendRequestService
    ) {}

    @Query(
        () => FriendRequestsQueryResultDto, { 
            name: 'sentFriendRequests',
            description: '로그인한 유저가 보낸 친구신청 목록을 가져오는 쿼리'
        })
    @UseGuards(GqlAuthGuard)
    async getSentFriendRequests(
        @CurrentUser() user: UserJwtPayload,
        @Args('pagination', {description: "페이지네이션 정보"}) pagination: PaginationInput 
    ): Promise<FriendRequestsQueryResultDto> {
        return await this.FriendRequestService.getFriendRequestsByRequestUserId(user._id, pagination);
    }

    @Query(
        () => FriendRequestsQueryResultDto, { 
            name: 'receivedFriendRequests',
            description: '로그인한 유저가 받은 친구신청 목록을 가져오는 쿼리입니다.'
        })
    @UseGuards(GqlAuthGuard)
    async getReceivedFriendRequests(
        @CurrentUser() user: UserJwtPayload,
        @Args('pagination', {description: "페이지네이션 정보"}) pagination: PaginationInput
    ): Promise<FriendRequestsQueryResultDto> {
        return await this.FriendRequestService.getFriendRequestsByReceiveUserId(user._id, pagination);
    }

    @Mutation(() => CreateFriendRequestResultDto, { 
        name: 'createFriendRequest',
        description: "로그인된 유저로부터 대상에게 친구신청을 생성하는 뮤테이션입니다."
    })
    @UseGuards(GqlAuthGuard)
    async createFriendRequest(
        @CurrentUser() user: UserJwtPayload,
        @Args('createFriendRequestData', {
            description: "친구신청 대상 유저 id와 친구신청 메시지를 담는 Input객체"
        }) reqData: CreateFriendRequestDto
    ): Promise<CreateFriendRequestResultDto> {
        return await this.FriendRequestService.createFriendRequest(user._id, reqData);
    }

    @Mutation(() => DeleteFriendRequestResultDto, { 
        name: 'deleteFriendRequest',
        description: "지정된 friendRequestId에 대한 친구신청을 삭제하는 뮤테이션입니다. 로그인한 유저가 해당 친구신청을 보내지 않았다면 삭제할 수 없습니다."
    })
    @UseGuards(GqlAuthGuard)
    async deleteFriendRequest(
        @CurrentUser() user: UserJwtPayload,
        @Args('friendRequestId', {
            description: "삭제할 친구신청 id"
        }) friendRequestId: string
    ): Promise<DeleteFriendRequestResultDto> {
        return await this.FriendRequestService.deleteFriendRequest(user._id, friendRequestId);
    }

    @Mutation(() => AcceptFriendRequestResultDto, { 
        name: 'acceptFriendRequest',
        description: "지정된 friendRequestId에 대한 친구신청을 승낙하는 뮤테이션입니다. 해당 뮤테이션이 처리되면 지정된 친구신청은 사라지며, 로그인된 유저와 친구신청을 받은 유저 서로 친구관계로 등록됩니다. 로그인된 유저가 받지 않은 친구신청은 승낙할 수 없습니다." 
    })
    @UseGuards(GqlAuthGuard)
    async acceptFriendRequest(
        @CurrentUser() user: UserJwtPayload,
        @Args('friendRequestId', {
            description: "승낙할 친구신청 id"
        }) friendRequestId: string
    ): Promise<AcceptFriendRequestResultDto> {
        return await this.FriendRequestService.acceptFriendRequest(user._id, friendRequestId);
    }
}
