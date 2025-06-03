import { Field, ObjectType, InputType, Int } from "@nestjs/graphql";
import { PageInfo } from "src/pagination/dto/pagination.dto";
import { UserSafeDto } from "src/user/dto/user.dto";


@ObjectType('Friend',
    {description: "친구를 나타내는 객체입니다."}
)
export class FriendDto{
    @Field(() => String,
        {description: "친구관계 자체를 나타내는 고유 id입니다."}
    )
    _id: string;

    @Field(() => UserSafeDto,
        {description: "친구에 대한 User객체를 나타냅니다."}
    )
    user: UserSafeDto;

    @Field(() => String,
        {description: "친구관계를 언제 형성했는지에 대한 시간을 나타냅니다."}
    )
    createdAt: string;
}

@ObjectType('FriendsQueryResult',
    {description: "친구 목록 쿼리 결과를 나타내는 객체입니다. Friend객체 배열과 페이지네이션 정보가 포함됩니다."}
)
export class FriendsQueryResultDto {
    @Field(() => [FriendDto])
    friends: FriendDto[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
}