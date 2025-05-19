import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UserSafeDto } from "src/user/dto/user.dto";
import { FriendState } from "../enums/userInfo.enum";

@ObjectType()
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