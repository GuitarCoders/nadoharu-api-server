import { Field, InputType, ObjectType } from "@nestjs/graphql";
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

@InputType('getPostFilter')
export class Filter{
    @Field(() => String, { nullable: true })
    userId?: string;

    @Field(() => String, { nullable: true })
    category?: string;

    @Field(() => String, { nullable: true })
    before?: string;

    // @Field(() => String, { nullable: true })
    // search?: string;
}

@InputType('GetPosts')
export class GetPostsDto{
    @Field(
        () => (Filter),
        { 
            nullable: true, 
            name: 'filter'
        }
    )
    filter?: Filter;

    @Field(() => Int)
    count: number;
}


@ObjectType('GetPostsResult')
export class GetPostsResultDto{
    @Field(() => [PostDto])
    posts: PostDto[];

    @Field(() => String)
    lastDateTime: string;

    @Field(() => Boolean)
    hasNext: boolean;
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