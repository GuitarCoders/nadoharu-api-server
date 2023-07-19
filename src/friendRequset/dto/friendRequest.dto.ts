import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { UserSafeDto } from "src/user/dto/user.dto";

@ObjectType('FriendRequest')
export class FriendRequestDto{
    @Field(() => String)
    _id: string;

    @Field(() => UserSafeDto)
    requestUser: UserSafeDto;

    @Field(() => UserSafeDto)
    receiveUser: UserSafeDto;

    @Field(() => String)
    requestMessage: string;

    @Field(() => String)
    createdAt: string;
}

@ObjectType('FriendRequestArray')
export class FriendRequestArrayDto{
    @Field(() => [FriendRequestDto])
    friendRequests: FriendRequestDto[]; 
}

//TODO: 이거 그냥 고민해보자 주석 달아놓은거.
@InputType('CreateFriendRequest')
export class CreateFriendRequestDto{
    // @Field(() => String)
    // requestUserId: string;

    @Field(() => String)
    receiveUserId: string;
    
    @Field(() => String)
    requestMessage: string;
}

@InputType('DeleteFriendRequest')
export class DeleteFriendRequestDto{
    @Field(() => String)
    friendRequestId: string;
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

@InputType('AcceptFriendRequest')
export class AcceptFriendRequestDto{
    @Field(() => String)
    friendRequestId: string;
}

@ObjectType('AcceptFriendRequestResult')
export class AcceptFriendRequestResultDto{
    @Field(() => String)
    success: boolean;
}