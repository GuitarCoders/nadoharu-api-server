import { Field, ObjectType } from "@nestjs/graphql";
import { UserSafeDto } from "src/user/dto/user.dto";


@ObjectType('UserInfo')
export class UserInfoDto{
    @Field(() => UserSafeDto)
    user: UserSafeDto;

    @Field(() => Boolean)
    isFriend: boolean
}