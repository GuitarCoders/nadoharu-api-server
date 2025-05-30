import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { PageTimeInfo } from "src/pagination/dto/pagination.dto";
import { UserSafeDto } from "src/user/dto/user.dto";
import { UserDocument } from "src/user/schemas/user.schema";
import { Int } from "type-graphql";

@ObjectType('Post')
export class PostDto{
    @Field(() => String)
    _id: string;

    @Field(() => UserSafeDto)
    author: UserDocument;

    @Field(() => String)
    content: string;

    @Field(() => String, { nullable: true })
    tags?: string;

    @Field(() => String)
    category: string;

    @Field(() => String)
    createdAt: string;
}

@ObjectType('PostArray')
export class PostArrayDto{
    @Field(() => [PostDto])
    Posts: PostDto[];
}

@InputType('PostFilter')
export class PostFilterInput{
    @Field(() => String, { nullable: true })
    category?: string;

    // @Field(() => String, { nullable: true })
    // search?: string;
}

@ObjectType('PostsQueryResult')
export class PostsQueryResultDto {
    @Field(() => [PostDto])
    posts: PostDto[];

    @Field(() => PageTimeInfo)
    pageInfo: PageTimeInfo
}

@InputType('CreatePostInput')
export class CreatePostDto{
    @Field(() => String)
    content: string;

    @Field(() => String, { nullable: true })
    tags?: string;

    @Field(() => String, { nullable: true })
    category?: string;
}

@ObjectType('CreatePostResult')
export class CreatePostResultDto{
    @Field(() => PostDto)
    post: PostDto;

    @Field(() => Boolean)
    success: boolean;
}

@InputType('DeletePost')
export class DeletePostDto {
    @Field(() => String)
    postId: string;
}

@ObjectType('DeletePostResult')
export class DeletePostResultDto {
    @Field(() => Boolean)
    success: boolean;
}

@ObjectType('test')
export class Test{
    @Field(() => Boolean)
    success: boolean;
}