import { Field, ObjectType, InputType, Int } from "@nestjs/graphql";
import { UserSafeDto } from "src/user/dto/user.dto";


@ObjectType('FriendTest')
export class test{
    @Field(() => String)
    result: string;
}

@ObjectType('Friend')
export class FriendDto{
    @Field(() => String)
    _id: string;

    @Field(() => UserSafeDto)
    user: UserSafeDto;

    @Field(() => String)
    createdAt: string;
}

@ObjectType('Friends')
export class FriendsDto{
    @Field(() => [FriendDto])
    friends: FriendDto[];
}

@InputType('getFriendsData')
export class getFriendsDto{
    @Field(() => String, {nullable: true})
    targetUserId?: string;

    @Field(() => Int)
    limit: number;

    @Field(() => Int, {nullable: true})
    skip?: number;
}