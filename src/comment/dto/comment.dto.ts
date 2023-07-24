import { Field, InputType,  ObjectType } from "@nestjs/graphql";
import { UserSafeDto } from "src/user/dto/user.dto";

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

@InputType('addCommentData')
export class addCommentDto{
    @Field(() => String)
    targetPostId: string;
  
    @Field(() => String)
    content: string;
}