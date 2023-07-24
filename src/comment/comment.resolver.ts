import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { PostDto } from 'src/post/dto/post.dto';
import { CommentService } from './comment.service';
import { CommentDto, commentFilter, CommentsDto } from './dto/comment.dto';

@Resolver()
export class CommentResolver {
    constructor(
        private readonly CommentService: CommentService
    ) {}

    @Query(() => CommentsDto, {name: "getCommentByPostId"})
    @UseGuards(GqlAuthGuard)
    async getCommentByPostId(
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
        })
    }
}
