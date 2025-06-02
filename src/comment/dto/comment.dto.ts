import { Field, InputType,  ObjectType } from "@nestjs/graphql";
import { before } from "node:test";
import { PageInfo} from "src/pagination/dto/pagination.dto";
import { UserSafeDto } from "src/user/dto/user.dto";
import { Int } from "type-graphql";

@ObjectType('Comment')
export class CommentDto{
    @Field(() => String)
    _id: string;

    @Field(() => String)
    content: string;

    @Field(() => String)
    postId: string;
    
    @Field(() => UserSafeDto)
    commenter: UserSafeDto;

    @Field(() => String)
    createdAt: string;
}

@ObjectType('Comments')
export class CommentsDto{
    @Field(() => [CommentDto])
    comments: CommentDto[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
}

@InputType('addCommentData')
export class addCommentDto{
    @Field(() => String)
    targetPostId: string;
  
    @Field(() => String)
    content: string;
}

@ObjectType('deleteCommentResult')
export class deleteCommentResultDto{
    @Field(() => Boolean)
    success: boolean;
}