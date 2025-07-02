import { Injectable } from '@nestjs/common';
import { PaginationInput } from 'src/pagination/dto/pagination.dto';
import { PostDto, PostFilterInput, PostsQueryResultDto } from '../dto/post.dto';
import { PostService } from '../post.service';
import { UserInfoService } from 'src/userInfo/userInfo.service';
import { UserService } from 'src/user/user.service';
import { PostMapper } from '../mapper/post.mapper';
import { NadoService } from 'src/nado/nado.service';
import { Types } from 'mongoose';
import { PaginationFrom } from 'src/pagination/enum/pagination.enum';

@Injectable()
export class PostAggregatorService {
    constructor(
        private PostService: PostService,
        private UserService: UserService,
        private NadoService: NadoService,
        private PostMapper: PostMapper
    ) {}

    async getPostsByUserId(
        requestUserId: string,
        targetUserId: string, 
        filter: PostFilterInput,
        pagination: PaginationInput
    ): Promise<PostsQueryResultDto> {
        try {


            const postsResult:PostsQueryResultDto = new PostsQueryResultDto();
            postsResult.posts = [];

            const tempPagination = structuredClone(pagination);

            postsResult.posts = [];
            postsResult.pageInfo = {
                hasOverStart: false,
                hasOverEnd: false,
                hasNext: false,
                startCursor: null,
                endCursor: null
            };

            const originPostListOfNadoPost: String[] = [];
            

            while(true) {

                const tempPostsDto 
                    = await this.PostService.getPostDocumentsByUserId(
                        targetUserId,
                        filter,
                        tempPagination
                    );

                const resultPostPromises = tempPostsDto.postDocs.map(async (postDocument):Promise<PostDto> => {
                    if (postDocument.isNadoPost) {

                        const nado = await this.NadoService.getNadoById(postDocument.nadoId.toHexString());
                        originPostListOfNadoPost.push(nado.post._id.toHexString());
                        const originPost = await this.PostService.getPostDocumentById(nado.post._id.toHexString());
                        await originPost.populate('author');

                        return {
                            _id: originPost._id.toHexString(),
                            author: originPost.author,
                            content: originPost.content,
                            tags: originPost.tags,
                            category: originPost.category,
                            isNadoPost: true,
                            nadoer: await this.UserService.getUserByIdSafe(nado.nadoer._id.toHexString()),
                            nadoCount: originPost.nadoCount,
                            createdAt: originPost.createdAt.toISOString()
                        }
                    } else {
                        return this.PostMapper.toPostDto(postDocument);
                    }
                })

                const resultPosts = await Promise.all(resultPostPromises);
                const filteredPosts = resultPosts.filter((post) => 
                    !originPostListOfNadoPost.includes(post._id) || post.isNadoPost
                );

                if (pagination.from === PaginationFrom.END) {
                    postsResult.posts.push(...filteredPosts);
                } else if (pagination.from === PaginationFrom.START) {
                    postsResult.posts.unshift(...filteredPosts);
                }

                // postsResult.posts.push(...filteredPosts);


                if (pagination.from === PaginationFrom.END) {
                    postsResult.pageInfo = {
                        hasOverStart: postsResult.pageInfo.hasOverStart ?? tempPostsDto.pageInfo.hasOverStart,
                        startCursor: postsResult.pageInfo.startCursor ?? tempPostsDto.pageInfo.startCursor,
                        hasOverEnd: tempPostsDto.pageInfo.hasOverEnd,
                        endCursor: tempPostsDto.pageInfo.endCursor,
                        hasNext: tempPostsDto.pageInfo.hasNext
                    }
                } else if (pagination.from === PaginationFrom.START) {
                    postsResult.pageInfo = {
                        hasOverStart: tempPostsDto.pageInfo.hasOverStart,
                        startCursor: tempPostsDto.pageInfo.startCursor,
                        hasOverEnd: postsResult.pageInfo.hasOverEnd ?? tempPostsDto.pageInfo.hasOverEnd,
                        endCursor: postsResult.pageInfo.endCursor ?? tempPostsDto.pageInfo.endCursor,
                        hasNext: tempPostsDto.pageInfo.hasNext
                    }
                }

                if (postsResult.posts.length >= pagination.limit || postsResult.pageInfo.hasNext === false) {
                    break;
                }

                tempPagination.cursor = pagination.from === PaginationFrom.END 
                    ? postsResult.pageInfo.endCursor
                    : postsResult.pageInfo.startCursor;
                    
                tempPagination.limit = pagination.limit - postsResult.posts.length;
            }

            return postsResult;

        } catch (err) {
            console.error(err);
        }
    }
}
