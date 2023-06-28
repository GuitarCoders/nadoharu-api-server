import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { Arg } from 'type-graphql';
import { CreatePostDto, CreatePostResultDto, Filter, GetPostsDto, GetPostsResultDto, Test } from './dto/post.dto';
import { PostService } from './post.service';

@Resolver()
export class PostResolver {
    constructor(
        private readonly PostService: PostService
    ) {}

    @Mutation(() => CreatePostResultDto,{ name: "createPost" })
    @UseGuards(GqlAuthGuard)
    async createPost(
        @CurrentUser() user: UserJwtPayload,
        @Args('createPostData') reqData: CreatePostDto
    ): Promise<CreatePostResultDto> {
        return await this.PostService.createPost(user._id, reqData);
    }

    @Query(() => GetPostsResultDto, { name: "getPostsForTimeline", description: "Deprecated"})
    @UseGuards(GqlAuthGuard)
    async getPostsForTimeline(
        @CurrentUser() user: UserJwtPayload,
        @Args('getPostsData') reqData: GetPostsDto
    ): Promise<GetPostsResultDto> {
        return await this.PostService.getPostsForTimeline(user._id, reqData);
    }

    @Query(() => GetPostsResultDto, { name: "getPosts"})
    @UseGuards(GqlAuthGuard)
    async Test(
        @CurrentUser() user: UserJwtPayload,
        @Args('filter', {nullable: true}) filter: Filter,
        @Args('count') count: Number
    ): Promise<GetPostsResultDto> {
        return await this.PostService.getPosts(user._id, {filter, count});
    }
}
