import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserJwtPayload } from 'src/auth/models/auth.model';
import { Arg, Int } from 'type-graphql';
import { CreatePostDto, CreatePostResultDto, DeletePostResultDto, PostFilterInput, PostsQueryResultDto, PostDto } from './dto/post.dto';
import { PostService } from './post.service';
import { PaginationInput } from 'src/pagination/dto/pagination.dto';

@Resolver()
export class PostResolver {
    constructor(
        private readonly PostService: PostService
    ) {}

    @Query(() => PostDto, {
        name: "post",
        description: "글 정보를 가져오는 쿼리입니다."    
    })
    @UseGuards(GqlAuthGuard)
    async getPost(
        @CurrentUser() user:UserJwtPayload,
        @Args('postId', {
            description: "가져올 글의 id입니다."
        }) targetPostId: string
    ): Promise<PostDto> {
        return await this.PostService.getPostById(targetPostId);
    }
        
    @Mutation(() => CreatePostResultDto, { 
        name: "createPost",
        description: "글을 작성하는 뮤테이션입니다."
    })
    @UseGuards(GqlAuthGuard)
    async createPost(
        @CurrentUser() user: UserJwtPayload,
        @Args('postData', {
            description: "글 작성에 필요한 정보를 담는 Input 객체입니다."
        }) reqData: CreatePostDto
    ): Promise<CreatePostResultDto> {
        return await this.PostService.createPost(user._id, reqData);
    }

    @Mutation(() => DeletePostResultDto, { 
        name: "deletePost",
        description: "특정 id에 해당하는 글을 지우는 뮤테이션입니다."
    })
    @UseGuards(GqlAuthGuard)
    async deletePost(
        @CurrentUser() user: UserJwtPayload,
        @Args('postId', {
            description: "지울 글의 id"
        }) postId: string
    ): Promise<DeletePostResultDto> {
        return await this.PostService.deletePost(user._id, postId);
    }
}
