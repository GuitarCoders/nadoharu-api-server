import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { NadoUsersDto } from "src/nado/dto/nado.dto";
import { PageInfo } from "src/pagination/dto/pagination.dto";
import { UserSafeDto, UsersSafeDto } from "src/user/dto/user.dto";
import { UserDocument } from "src/user/schemas/user.schema";

@ObjectType('Post', {
    description: "글 정보를 표현하는 객체입니다. 기본 글 정보에 나도 여부, 나도한 사람 등의 추가 정보가 포함됩니다."
})
export class AggregatedPostDto{
    @Field(() => String, {
        description: "글의 고유 id입니다."
    })
    _id: string;

    @Field(() => UserSafeDto, {
        description: "글을 작성한 유저의 User 객체입니다."
    })
    author: UserDocument;

    @Field(() => String, {
        description: "글의 내용입니다."
    })
    content: string;

    @Field(() => String, { 
        nullable: true,
        description: "글의 태그입니다. 내용이 없을 수도 있습니다."
    })
    tags?: string;

    @Field(() => String, {
        nullable: true,
        description: "글의 카테고리입니다. 관련 기능이 아직 구현되어있지 않습니다."
    })
    category?: string;

    @Field(() => Int, {
        description: "글에 달린 댓글의 갯수입니다."
    })
    commentCount: Number;

    @Field(() => Int, {
        description: "글이 얻은 나도 반응의 갯수입니다."
    })
    nadoCount: number;

    @Field(() => Boolean, {
        description: "글을 요청한 유저가 해당 글에 나도를 눌렀는지 여부입니다."
    })
    isNadoed: boolean;

    @Field(() => Boolean, {
        description: "글이 다른사람의 '나도' 반응을 통해 전달되었는지 여부입니다."
    })
    isNadoPost: boolean;

    @Field(() => UserSafeDto, {
        nullable: true,
        description: "나도를 통해 전달된 글인 경우, 해당 '나도' 반응을 한 사람입니다. 내용이 없을 수도 있습니다."
    })
    nadoer?: UserSafeDto

    @Field(() => NadoUsersDto, {
        nullable: true,
        description: "글에 나도를 누른 사람들의 목록입니다. 내용이 없을 수도 있습니다. 페이지 정보를 포함합니다."
    })
    nadoUsers?: NadoUsersDto

    @Field(() => String, {
        description: "글을 작성한 시간입니다."
    })
    createdAt: string;
}

@ObjectType('PostsQueryResult',
    {description: "글 목록 쿼리 결과 객체입니다. Post객체를 배열로 가지고 있습니다. 페이지네이션을 위한 정보가 포함되어있습니다."}
)
export class AggregatedPostsQueryResultDto {
    @Field(() => [AggregatedPostDto])
    posts: AggregatedPostDto[];

    @Field(() => PageInfo)
    pageInfo: PageInfo
}