import { Field, InputType, ObjectType } from "@nestjs/graphql";


@ObjectType('Post')
export class PostDto{
    @Field(() => String)
    _id: string;

    @Field(() => String)
    authorId: string;

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

@InputType('GetPosts')
export class GetPostsDto{
    @Field(
        () => ({userId: String, before: String}),
        { nullable: true }
    )
    options?: {
        userId?: string,
        before?: string,
    };

    @Field(() => String)
    count: Number;
}

@ObjectType('GetPostsResult')
export class GetPostsResultDto{
    @Field(() => [PostDto])
    posts: PostDto[];

    @Field(() => String)
    lastDateTime: string;
}

@InputType('CreatePost')
export class CreatePostDto{
    @Field(() => String)
    content: string;

    @Field(() => String, { nullable: true })
    tags?: string;

    @Field(() => String, { nullable: true })
    category?: string;
}

@ObjectType('CreatePostResult')
export class CreatePostResultDto extends PostDto{
    @Field(() => Boolean)
    success: boolean;
}