import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { PostDto } from 'src/post/dto/post.dto';
import { CommentService } from './comment.service';
import { CommentDto, CommentsDto, deleteCommentResultDto } from './dto/comment.dto';
import { PaginationTimeInput } from 'src/pagination/dto/pagination.dto';

@Resolver()
export class CommentResolver {
    constructor(
        private readonly CommentService: CommentService
    ) {}

    @Query(() => CommentsDto, {name: "comments"})
    @UseGuards(GqlAuthGuard)
    async getCommentByPostId (
        @Args('postId') targetPostId: string,
        @Args('pagination') pagination: PaginationTimeInput
    ): Promise<CommentsDto> {
        return await this.CommentService.getCommentsByPostId(targetPostId, pagination);
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
