import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { PostDto } from 'src/post/dto/post.dto';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';

@Resolver()
export class CommentResolver {
    constructor(
        private readonly CommentService: CommentService
    ) {}

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
