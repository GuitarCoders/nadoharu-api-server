import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { Arg, Int } from 'type-graphql';
import { CreatePostDto, CreatePostResultDto, DeletePostDto, DeletePostResultDto, PostFilterInput, PostsQueryResultDto, PostDto, Test } from './dto/post.dto';
import { PostService } from './post.service';
import { PaginationInput } from 'src/pagination/dto/pagination.dto';

@Resolver()
export class PostResolver {
    constructor(
        private readonly PostService: PostService
    ) {}

    @Query(() => PostDto, { name: "post"})
    @UseGuards(GqlAuthGuard)
    async getPost(
        @CurrentUser() user:UserJwtPayload,
        @Args('postId') targetPostId: string
    ): Promise<PostDto> {
        return await this.PostService.getPostById(targetPostId);
    }

    @Query(() => PostsQueryResultDto, { name: "postsByUserId"})
    @UseGuards(GqlAuthGuard)
    async getPostsByUserId(
        @CurrentUser() user: UserJwtPayload,
        @Args('targetUserId') targetUserId: string,
        @Args('filter') filter: PostFilterInput,
        @Args('pagination') pagination: PaginationInput
    ): Promise<PostsQueryResultDto> {
        return await this.PostService.getPostsByUserId(targetUserId, filter, pagination);
    }

    @Query(() => PostsQueryResultDto, { name: "postsForTimeline"})
    @UseGuards(GqlAuthGuard)
    async getPostsForTimeline(
        @CurrentUser() user: UserJwtPayload,
        @Args('filter') filter: PostFilterInput,
        @Args('pagination') pagination: PaginationInput
    ): Promise<PostsQueryResultDto> {
        return await this.PostService.getPostsForTimeline(user._id, pagination);
    }

    @Query(() => PostsQueryResultDto, { name: "postsByMe"})
    @UseGuards(GqlAuthGuard)
    async getPostsByMe(
        @CurrentUser() user: UserJwtPayload,
        @Args('filter') filter: PostFilterInput,
        @Args('pagination') pagination: PaginationInput
    ): Promise<PostsQueryResultDto> {
        return await this.PostService.getPostsByUserId(user._id, filter, pagination);
    }
        
    @Mutation(() => CreatePostResultDto,{ name: "createPost" })
    @UseGuards(GqlAuthGuard)
    async createPost(
        @CurrentUser() user: UserJwtPayload,
        @Args('input') reqData: CreatePostDto
    ): Promise<CreatePostResultDto> {
        return await this.PostService.createPost(user._id, reqData);
    }

    @Mutation(() => DeletePostResultDto, { name: "deletePost"})
    @UseGuards(GqlAuthGuard)
    async deletePost(
        @CurrentUser() user: UserJwtPayload,
        @Args('deletePostData') reqData: DeletePostDto
    ): Promise<DeletePostResultDto> {
        return await this.PostService.deletePost(user._id, reqData);
    }
}
