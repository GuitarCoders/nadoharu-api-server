import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType('CreateFriendRequest')
export class CreateFriendRequestDto{
    @Field(() => String)
    requestUserId: string;
    
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

@ObjectType('FriendRequest')
export class FriendRequestDto{
    @Field(() => String)
    _id: string;

    @Field(() => String)
    requestUserId: string;

    @Field(() => String)
    receiveUserId: string;

    @Field(() => String)
    requestMessage: string;

    @Field(() => String)
    createdAt: string;
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