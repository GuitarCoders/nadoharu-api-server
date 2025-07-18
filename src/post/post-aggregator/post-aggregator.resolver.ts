import { Args, Query, Resolver } from '@nestjs/graphql';
import { PostAggregatorService } from './post-aggregator.service';
import { PostDto, PostFilterInput, PostsQueryResultDto } from '../dto/post.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { PaginationInput } from 'src/pagination/dto/pagination.dto';
import { AggregatedPostDto, AggregatedPostsQueryResultDto } from './dto/post-aggregator.dto';

@Resolver()
export class PostAggregatorResolver {
    constructor (
        private readonly PostAggregatorService: PostAggregatorService
    ) {}

    @Query(() => AggregatedPostDto, {
        name: "post",
        description: "글 정보를 가져오는 쿼리입니다."    
    })
    @UseGuards(GqlAuthGuard)
    async getPost(
        @CurrentUser() user:UserJwtPayload,
        @Args('postId', {
            description: "가져올 글의 id입니다."
        }) targetPostId: string,
        @Args('nadoUsersPagination', {
            nullable: true,
            description: "각 글들의 나도를 누른 유저를 가져오기 위한 페이지네이션 정보. 해당 옵션은 생략할 수 있으나, 생략할 경우 nadoUsers를 가져오지 않습니다."
        }) nadoPagination?: PaginationInput
    ): Promise<PostDto> {
        return await this.PostAggregatorService.getPostById(user._id, targetPostId, nadoPagination);
    }

    @Query(() => AggregatedPostsQueryResultDto, { 
        name: "postsByMe",
        description: "로그인한 유저가 작성한 글 목록을 가져오는 쿼리입니다."
    })
    @UseGuards(GqlAuthGuard)
    async getPostsByMe(
        @CurrentUser() user: UserJwtPayload,
        @Args('filter', {
            description: "작성한 글의 카테고리 등의 분류를 위한 필터. 아직 카테고리등의 기능을 구현하지 않았으므로 필터 안의 내용을 비워서 쿼리를 보내주시기 바랍니다."
        }) filter: PostFilterInput,
        @Args('pagination', {
            description: "페이지네이션 정보"
        }) pagination: PaginationInput,
        @Args('nadoUsersPagination', {
            nullable: true,
            description: "각 글들의 나도를 누른 유저를 가져오기 위한 페이지네이션 정보. 해당 옵션은 생략할 수 있으나, 생략할 경우 nadoUsers를 가져오지 않습니다."
        }) nadoPagination?: PaginationInput
    ): Promise<PostsQueryResultDto> {
        return await this.PostAggregatorService.getPostsByUserId(user._id, user._id, filter, pagination, nadoPagination);
    }

    @Query(() => AggregatedPostsQueryResultDto, { 
        name: "postsByUserId",
        description: "특정 유저의 id를 통해 해당 유저가 작성한 글 목록을 가져오는 쿼리입니다."
    })
    @UseGuards(GqlAuthGuard)
    async getPostsByUserId(
        @CurrentUser() user: UserJwtPayload,
        @Args('targetUserId', {
            description: "글 작성자의 id"
        }) targetUserId: string,
        @Args('filter', {
            description: "작성한 글의 카테고리 등의 분류를 위한 필터. 아직 카테고리등의 기능을 구현하지 않았으므로 필터 안의 내용을 비워서 쿼리를 보내주시기 바랍니다."
        }) filter: PostFilterInput,
        @Args('pagination', {
            description: "페이지네이션 정보"
        }) pagination: PaginationInput,
        @Args('nadoUsersPagination', {
            nullable: true,
            description: "각 글들의 나도를 누른 유저를 가져오기 위한 페이지네이션 정보. 해당 옵션은 생략할 수 있으나, 생략할 경우 nadoUsers를 가져오지 않습니다."
        }) nadoPagination?: PaginationInput
    ): Promise<PostsQueryResultDto> {
        return await this.PostAggregatorService.getPostsByUserId(user._id, targetUserId, filter, pagination, nadoPagination);
    }

    @Query(() => AggregatedPostsQueryResultDto, { 
        name: "postsForTimeline",
        description: "로그인한 유저 기준 타임라인에 표시될 글 목록을 가져오는 쿼리입니다. 로그인한 유저를 포함하여 친구들의 글들을 시간순으로 가져옵니다."
    })
    @UseGuards(GqlAuthGuard)
    async getPostsForTimeline(
        @CurrentUser() user: UserJwtPayload,
        @Args('pagination', {
            description: "페이지네이션 정보"
        }) pagination: PaginationInput,
        @Args('nadoUsersPagination', {
            nullable: true,
            description: "각 글들의 나도를 누른 유저를 가져오기 위한 페이지네이션 정보. 해당 옵션은 생략할 수 있으나, 생략할 경우 nadoUsers를 가져오지 않습니다."
        }) nadoPagination?: PaginationInput
    ): Promise<PostsQueryResultDto> {
        return await this.PostAggregatorService.getPostsForTimeline(user._id, pagination, nadoPagination);
    }

}
