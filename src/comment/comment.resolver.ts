import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { PostDto } from 'src/post/dto/post.dto';
import { CommentService } from './comment.service';
import { CommentDto, commentFilter, CommentsDto, deleteCommentResultDto } from './dto/comment.dto';

@Resolver()
export class CommentResolver {
    constructor(
        private readonly CommentService: CommentService
    ) {}

    @Query(() => CommentsDto, {
        name: "getCommentByPostId",
        deprecationReason: '쿼리 명명규칙이 변경됨에 따라 더이상 해당 쿼리는 사용하지 않습니다. comments 쿼리가 해당 쿼리를 완벽히 대체합니다.'
    })
    @UseGuards(GqlAuthGuard)
    async getCommentByPostIdDeprecated (
        @Args('postId') targetPostId: string,
        @Args('filter') commentFilter: commentFilter
    ): Promise<CommentsDto> {
        return await this.CommentService.getCommentsByPostId(targetPostId, commentFilter);
    }

    @Query(() => CommentsDto, {name: "comments"})
    @UseGuards(GqlAuthGuard)
    async getCommentByPostId (
        @Args('postId') targetPostId: string,
        @Args('filter') commentFilter: commentFilter
    ): Promise<CommentsDto> {
        return await this.CommentService.getCommentsByPostId(targetPostId, commentFilter);
    }

    @Mutation(() => CommentDto, {name: "addCommentToPost"})
    @UseGuards(GqlAuthGuard)
    async addCommentToPost(
        @CurrentUser() user: UserJwtPayload,
        @Args('targetPostId') targetPostId: string,
        @Args('content') content: string,
    ): Promise<CommentDto> {
        return await this.CommentService.addCommentToPost(
            user._id, 
            {
                targetPostId: targetPostId,
                content: content
            }
        )
    }

    @Mutation(() => deleteCommentResultDto, {name: "deleteCommentById"})
    @UseGuards(GqlAuthGuard)
    async deleteCommentById(
        @CurrentUser() user: UserJwtPayload,
        @Args('targetCommentId') targetCommentId: string
    ): Promise<deleteCommentResultDto> {
        return await this.CommentService.deleteCommentById(targetCommentId, user._id);
    }
}
