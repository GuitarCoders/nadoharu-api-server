import { Args, Query, Resolver } from '@nestjs/graphql';
import { PostAggregatorService } from './post-aggregator.service';
import { PostFilterInput, PostsQueryResultDto } from '../dto/post.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { PaginationInput } from 'src/pagination/dto/pagination.dto';

@Resolver()
export class PostAggregatorResolver {
    constructor (
        private readonly PostAggregatorService: PostAggregatorService
    ) {}

    @Query(() => PostsQueryResultDto)
    @UseGuards(GqlAuthGuard)
    async getUserPostsDemo(
        @CurrentUser() user: UserJwtPayload,
        @Args('targetUserId', {
            description: "글 작성자의 id"
        }) targetUserId: string,
        @Args('filter', {
            description: "작성한 글의 카테고리 등의 분류를 위한 필터. 아직 카테고리등의 기능을 구현하지 않았으므로 필터 안의 내용을 비워서 쿼리를 보내주시기 바랍니다."
        }) filter: PostFilterInput,
        @Args('pagination', {
            description: "페이지네이션 정보"
        }) pagination: PaginationInput
    ): Promise<PostsQueryResultDto> {
        return await this.PostAggregatorService.getPostsByUserId(targetUserId, filter, pagination);
    }

    @Query(() => PostsQueryResultDto)
    @UseGuards(GqlAuthGuard)
    async getPostsForTimelineDemo(
        @CurrentUser() user: UserJwtPayload,
        @Args('pagination', {
            description: "페이지네이션 정보"
        }) pagination: PaginationInput
    ): Promise<PostsQueryResultDto> {
        return await this.PostAggregatorService.getPostsForTimeline(user._id, pagination);
    }

}
