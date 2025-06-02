import { Field, ObjectType, InputType, Int } from "@nestjs/graphql";
import { PageInfo } from "src/pagination/dto/pagination.dto";
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

@ObjectType('FriendsQueryResult')
export class FriendsQueryResultDto {
    @Field(() => [FriendDto])
    friends: FriendDto[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
}

@InputType('FriendsFilter')
export class FriendsFilterInput{
    @Field(() => String, {nullable: true})
    targetUserId?: string;

    @Field(() => Int)
    limit: number;

    @Field(() => Int, {nullable: true})
    skip?: number;
}