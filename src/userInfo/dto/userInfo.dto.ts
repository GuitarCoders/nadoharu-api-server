import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UserSafeDto } from "src/user/dto/user.dto";
import { FriendState } from "../enum/userInfo.enum";

@ObjectType('UserInfos')
export class UserInfosDto {
    @Field(() => [UserInfoDto])
    users: UserInfoDto[];
}

@ObjectType('UserInfo')
export class UserInfoDto {
    @Field(() => UserSafeDto)
    user: UserSafeDto;

    @Field(() => FriendState)
    isFriend: FriendState;

    @Field(() => Boolean)
    isFriendRequested: boolean;

    @Field(() => Int)
    friendCount: Number;
}

@ObjectType('AboutMe')
export class AboutMeDto{
    @Field(() => UserSafeDto)
    user: UserSafeDto;

    @Field(() => FriendState)
    isFriend: FriendState;

    @Field(() => Boolean)
    isFriendRequested: boolean;

    @Field(() => Int)
    friendCount: Number;

    @Field(() => Int)
    receivedFriendRequestCount: Number;
}