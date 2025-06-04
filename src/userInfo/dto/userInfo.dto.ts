import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UserSafeDto } from "src/user/dto/user.dto";
import { FriendState } from "../enum/userInfo.enum";

@ObjectType('UserInfos',
    {description: "유저 상세정보 목록을 userInfo객체 배열로 가진 객체입니다."}
)
export class UserInfosDto {
    @Field(() => [UserInfoDto])
    users: UserInfoDto[];
}

@ObjectType('UserInfo',
    {description: "유저의 상세정보입니다. user객체 외 추가적으로 특정 대상과 친구인지, 친구신청을 보냈는지, 해당 유저의 친구 수 등의 추가정보를 담고 있습니다."}
)
export class UserInfoDto {
    @Field(() => UserSafeDto, {
        description: "유저의 기본 정보입니다."
    })
    user: UserSafeDto;

    @Field(() => FriendState, {
        description: "해당 유저와 친구인지를 나타냅니다. 가져온 정보가 자기 자신일 경우 'ME'로 표현합니다."
    })
    isFriend: FriendState;

    @Field(() => Boolean, {
        description: "해당 유저에게 친구신청을 보냈는지 여부입니다."
    })
    isFriendRequested: boolean;

    @Field(() => Int, {
        description: "해당 유저의 친구 수 입니다. 인싸력을 테스트 해볼 수 있습니다."
    })
    friendCount: Number;
}

@ObjectType('AboutMe', {
    description: "자기 자신에 대한 상세정보입니다. user객체 외 주로 프로필 화면에 필요한 정보들을 담고 있습니다."
})
export class AboutMeDto extends UserInfoDto {
    @Field(() => Int, {
        description: "자신이 받은 친구신청 수 입니다."
    })
    receivedFriendRequestCount: Number;
}