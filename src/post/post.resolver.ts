import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { CreatePostDto, CreatePostResultDto } from './dto/post.dto';
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
}
