import { Field, ObjectType, InputType, Int } from "@nestjs/graphql";


@ObjectType('FriendTest')
export class test{
    @Field(() => String)
    result: string;
}

@InputType('getFriendsData')
export class getFriendDto{
    @Field(() => String, {nullable: true})
    targetUserId?: string;

    @Field(() => Int)
    limit: number;

    @Field(() => Int, {nullable: true})
    skip?: number;
}