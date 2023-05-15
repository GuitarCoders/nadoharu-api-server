import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class CreateFriendRequestDto{
    @Field(() => String)
    requestUserId: string;

    @Field(() => String)
    receiveUserId: string;

    @Field(() => String)
    requestMessage: string;
}