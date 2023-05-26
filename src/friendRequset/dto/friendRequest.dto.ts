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

@ObjectType('CreateFriendResult')
export class CreateFriendResultDto extends FriendRequestDto{
    @Field(() => Boolean)
    success: boolean;
}

@ObjectType('Test')
export class Test{
    @Field(() => Boolean)
    success: boolean;
}