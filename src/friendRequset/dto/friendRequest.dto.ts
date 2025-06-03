import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { PageInfo } from "src/pagination/dto/pagination.dto";
import { UserSafeDto } from "src/user/dto/user.dto";

@ObjectType('FriendRequest', {
    description: "친구신청 관련 객체입니다."
})
export class FriendRequestDto{
    @Field(() => String, {description: "친구신청 고유 id입니다."})
    _id: string;

    @Field(() => UserSafeDto, {description: "친구신청을 요청한 User객체입니다."})
    requester: UserSafeDto;

    @Field(() => UserSafeDto, {description: "친구신청을 받은 User객체입니다."})
    receiver: UserSafeDto;

    @Field(() => String, {description: "친구신청 메세지입니다."})
    requestMessage: string;

    @Field(() => String, {description: "친구신청이 생성된 시간입니다."})
    createdAt: string;
}

@ObjectType('FriendRequestsQueryResult', {
    description: "친구신청 목록 쿼리 결과를 나타내는 객체입니다. FriendRequest객체 배열과 페이지네이션 정보가 포함됩니다."
})
export class FriendRequestsQueryResultDto{
    @Field(() => [FriendRequestDto])
    friendRequests: FriendRequestDto[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
}

@InputType('CreateFriendRequest', {
    description: "친구신청을 생성하기 위해 필요한 Input 객체입니다."
})
export class CreateFriendRequestDto{
    @Field(() => String, {description: "친구신청을 보낼 유저의 id입니다."})
    receiver: string;
    
    @Field(() => String, {description: "친구신청 메세지 내용입니다."})
    requestMessage: string;
}

@ObjectType('CreateFriendRequestResult')
export class CreateFriendRequestResultDto extends FriendRequestDto{
    @Field(() => Boolean)
    success: boolean;
}

@ObjectType('DeleteFriendRequestResult')
export class DeleteFriendRequestResultDto{
    @Field(() => Boolean)
    success: boolean;
}

@ObjectType('AcceptFriendRequestResult')
export class AcceptFriendRequestResultDto{
    @Field(() => String)
    success: boolean;
}