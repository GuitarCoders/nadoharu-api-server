import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { Arg, Int } from 'type-graphql';
import { CreatePostDto, CreatePostResultDto, DeletePostDto, DeletePostResultDto, Filter, GetPostsDto, GetPostsResultDto, PostDto, Test } from './dto/post.dto';
import { PostService } from './post.service';

@Resolver()
export class PostResolver {
    constructor(
        private readonly PostService: PostService
    ) {}

    @Query(() => PostDto, { name: "getPost"})
    @UseGuards(GqlAuthGuard)
    async getPost(
        @CurrentUser() user:UserJwtPayload,
        @Args('postId') targetPostId: string
    ): Promise<PostDto> {
        return await this.PostService.getPostById(targetPostId);
    }
    
    @Query(() => GetPostsResultDto, { name: "getPosts"})
    @UseGuards(GqlAuthGuard)
    async getPosts(
        @CurrentUser() user: UserJwtPayload,
        @Args('getPostsData') reqData: GetPostsDto
    ): Promise<GetPostsResultDto> {
        return await this.PostService.getPosts(user._id, reqData);
    }

    @Query(() => GetPostsResultDto, { name: "getPostsFromMe"})
    @UseGuards(GqlAuthGuard)
    async getPostsFromMe(
        @CurrentUser() user: UserJwtPayload,
        @Args('count', {type: () => Int}) count: number,
        @Args('before', {type: () => String, nullable: true}) before?: string
    ): Promise<GetPostsResultDto> {
        return await this.PostService.getPosts(user._id, {count: count, filter:{userId: user._id, before:before}});
    }
        
    @Mutation(() => CreatePostResultDto,{ name: "createPost" })
    @UseGuards(GqlAuthGuard)
    async createPost(
        @CurrentUser() user: UserJwtPayload,
        @Args('createPostData') reqData: CreatePostDto
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

    //TODO : 해당 쿼리가 필요한지 확인
    // @Query(() => GetPostsResultDto, { name: "getPostsForTimeline", description: "Deprecated"})
    // @UseGuards(GqlAuthGuard)
    // async getPostsForTimeline(
    //     @CurrentUser() user: UserJwtPayload,
    //     @Args('getPostsData') reqData: GetPostsDto
    // ): Promise<GetPostsResultDto> {
    //     return await this.PostService.getPostsForTimeline(user._id, reqData);
    // }

}
