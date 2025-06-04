import { Field, InputType,  ObjectType } from "@nestjs/graphql";
import { before } from "node:test";
import { PageInfo} from "src/pagination/dto/pagination.dto";
import { UserSafeDto } from "src/user/dto/user.dto";
import { Int } from "type-graphql";

@ObjectType('Comment',
    {description: "댓글의 주요 정보를 포함하는 객체입니다."}
)
export class CommentDto{
    @Field(
        () => String, 
        {description: "댓글의 고유 id입니다."}
    )
    _id: string;

    @Field(
        () => String,
        {description: "댓글의 내용입니다."}
    )
    content: string;

    @Field(
        () => String,
        {description: "댓글이 속한 게시글의 고유 id입니다."}
    )
    postId: string;
    
    @Field(
        () => UserSafeDto,
        {description: "댓글의 작성자 User 객체입니다."}
    )
    commenter: UserSafeDto;

    @Field(
        () => String,
        {description: "댓글을 작성한 시간입니다."}
    )
    createdAt: string;
}

@ObjectType('CommentsQueryResult',
    {description: "여러개의 댓글을 배열로 가지고 있는 객체입니다. 페이지네이션 정보가 포함되어있습니다."}
)
export class CommentsQueryResultDto{
    @Field(() => [CommentDto])
    comments: CommentDto[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
}

@InputType('addCommentData',
    {description: "댓글 작성에 필요한 정보를 담는 Input Type입니다."}
)
export class addCommentDto{
    @Field(
        () => String,
        {description: "해당 댓글이 달릴 글의 id입니다."}
    )
    targetPostId: string;
  
    @Field(
        () => String,
        {description: "댓글의 내용입니다."}
    )
    content: string;
}

@ObjectType('deleteCommentResult',
    {description: "댓글이 삭제되었는지에 대한 결과입니다."}
)
export class deleteCommentResultDto{
    @Field(() => Boolean)
    success: boolean;
}