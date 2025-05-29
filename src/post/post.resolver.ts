import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { Arg, Int } from 'type-graphql';
import { CreatePostDto, CreatePostResultDto, DeletePostDto, DeletePostResultDto, PostFilterInput, GetPostsResultDto, PostDto, Test } from './dto/post.dto';
import { PostService } from './post.service';

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

    @Query(() => GetPostsResultDto, { name: "posts"})
    @UseGuards(GqlAuthGuard)
    async getPosts(
        @CurrentUser() user: UserJwtPayload,
        @Args('targetUserId', {nullable: true}) targetUserId: string,
        @Args('filter') filter: PostFilterInput
    ): Promise<GetPostsResultDto> {
        return await this.PostService.getPosts(user._id, filter, targetUserId);
    }

    @Query(() => GetPostsResultDto, { name: "postsByMe"})
    @UseGuards(GqlAuthGuard)
    async getPostsByMe(
        @CurrentUser() user: UserJwtPayload,
        @Args('filter') filter: PostFilterInput
    ): Promise<GetPostsResultDto> {
        return await this.PostService.getPosts(user._id, filter, user._id);
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

    //TODO : 해당 쿼리가 필요한지 확인
    // @Query(() => GetPostsResultDto, { name: "getPostsForTimeline", description: "Deprecated"})
    // @UseGuards(GqlAuthGuard)
    // async getPostsForTimeline(
    //     @CurrentUser() user: UserJwtPayload,
    //     @Args('getPostsData') reqData: GetPostsDto
    // ): Promise<GetPostsResultDto> {
    //     return await this.PostService.getPostsForTimeline(user._id, reqData);
    // }


    // ========== Deprecated resolvers ==========
    @Query(() => PostDto, { 
        name: "getPost",
        deprecationReason: '쿼리 명명규칙이 변경됨에 따라 더이상 해당 쿼리는 사용하지 않습니다. post 쿼리가 해당 쿼리를 완벽히 대체합니다.'
    })
    @UseGuards(GqlAuthGuard)
    async getPostDeprecated(
        @CurrentUser() user:UserJwtPayload,
        @Args('postId') targetPostId: string
    ): Promise<PostDto> {
        return await this.PostService.getPostById(targetPostId);
    }
}
