import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { PostDto } from 'src/post/dto/post.dto';
import { CommentService } from './comment.service';
import { CommentDto, CommentsDto, deleteCommentResultDto } from './dto/comment.dto';
import { PaginationInput } from 'src/pagination/dto/pagination.dto';

@Resolver()
export class CommentResolver {
    constructor(
        private readonly CommentService: CommentService
    ) {}

    @Query(
        () => CommentsDto, 
        {
            name: "comments",
            description: "특정 글의 댓글을 가져오는 쿼리입니다."
        })
    @UseGuards(GqlAuthGuard)
    async getCommentByPostId (
        @Args('postId', {description: "댓글을 가져올 대상 글의 id"}) targetPostId: string,
        @Args('pagination', {description: "페이지네이션 정보"}) pagination: PaginationInput
    ): Promise<CommentsDto> {
        return await this.CommentService.getCommentsByPostId(targetPostId, pagination);
    }

    @Mutation(
        () => CommentDto, 
        {
            name: "addCommentToPost",
            description: "특정 글에 댓글을 작성하는 뮤테이션입니다."
        })
    @UseGuards(GqlAuthGuard)
    async addCommentToPost(
        @CurrentUser() user: UserJwtPayload,
        @Args('targetPostId', {description: "댓글을 작성할 대상 글의 id"}) targetPostId: string,
        @Args('content', {description: "댓글의 내용"}) content: string,
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
        @Args('targetCommentId', {description: "삭제할 댓글의 id"}) targetCommentId: string
    ): Promise<deleteCommentResultDto> {
        return await this.CommentService.deleteCommentById(targetCommentId, user._id);
    }
}
