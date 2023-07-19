import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType('addAllUserInFriendResult')
export class result {
    @Field(() => Boolean)
    success: boolean
}