import { Field, InputType,  ObjectType } from "@nestjs/graphql";
import { before } from "node:test";
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
    Commenter: UserSafeDto;

    @Field(() => String)
    createdAt: String;
}

@ObjectType('Comments')
export class CommentsDto{
    @Field(() => [CommentDto])
    comments: CommentDto[];

    @Field(() => String)
    lastDateTime: String;
}

@InputType('addCommentData')
export class addCommentDto{
    @Field(() => String)
    targetPostId: string;
  
    @Field(() => String)
    content: string;
}

@InputType('commentFilter')
export class commentFilter{
    @Field(() => Int, {nullable: true})
    skip?: number;

    @Field(() => Int)
    limit: number;
}

@ObjectType('deleteCommentResult')
export class deleteCommentResultDto{
    @Field(() => Boolean)
    success: boolean;
}