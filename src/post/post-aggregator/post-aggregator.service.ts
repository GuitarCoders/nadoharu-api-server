import { Injectable } from '@nestjs/common';
import { PageInfo, PaginationInput } from 'src/pagination/dto/pagination.dto';
import { PostDto, PostFilterInput, PostsQueryResultDto } from '../dto/post.dto';
import { PostService } from '../post.service';
import { UserInfoService } from 'src/userInfo/userInfo.service';
import { UserService } from 'src/user/user.service';
import { PostMapper } from '../mapper/post.mapper';
import { NadoService } from 'src/nado/nado.service';
import { Types } from 'mongoose';
import { PaginationFrom } from 'src/pagination/enum/pagination.enum';
import { PostDocument } from '../schemas/post.schema';
import { PostAggregatorMapper } from './mapper/post-aggregator.mapper';

@Injectable()
export class PostAggregatorService {
    constructor(
        private PostService: PostService,
        private UserService: UserService,
        private NadoService: NadoService,
        private PostAggregatorMapper: PostAggregatorMapper,
        private PostMapper: PostMapper
    ) {}

    async getPostById(
        requestUserId: string, postId: string
    ): Promise<PostDto> {
        const postDoc = await this.PostService.getPostDocumentById(postId);
        await postDoc.populate('author');
        return await this.PostAggregatorMapper.toPostDto(postDoc, requestUserId);
    }

    async getPostsByUserId(
        requestUserId: string,
        targetUserId: string,
        filter: PostFilterInput,
        pagination: PaginationInput
    ): Promise<PostsQueryResultDto> {
        return await this.getPostsExcludingNadoOrigins(
            requestUserId, targetUserId, filter, pagination, 
            this.PostService.getPostDocumentsByUserId.bind(this.PostService)
        )
    }

    async getPostsForTimeline(
        userId: string,
        pagination: PaginationInput
    ): Promise<PostsQueryResultDto> {
        return await this.getPostsExcludingNadoOrigins(
            userId, userId, null, pagination,
            this.getPostsForTimelineWrapper.bind(this)
        );
    }

    async getPostsForTimelineWrapper(
        userId: string,
        filter: PostFilterInput,
        pagination: PaginationInput
    ): Promise<{postDocs: PostDocument[], pageInfo: PageInfo}> {
        return this.PostService.getPostDocumentsForTimeline(userId, pagination);
    }    

    async getPostsExcludingNadoOrigins(
        requestUserId: string,
        targetUserId: string, 
        filter: PostFilterInput,
        pagination: PaginationInput,
        fetchPosts?: (
            targetUserId: string, 
            filter: PostFilterInput, 
            pagination: PaginationInput
        ) => Promise<{postDocs: PostDocument[], pageInfo: PageInfo}>
    ): Promise<PostsQueryResultDto> {
        try {


            const totalPosts:PostsQueryResultDto = new PostsQueryResultDto();
            totalPosts.posts = [];

            const tempPagination = structuredClone(pagination);
            console.log(tempPagination);

            totalPosts.posts = [];
            totalPosts.pageInfo = {
                hasOverStart: false,
                hasOverEnd: false,
                hasNext: false,
                startCursor: null,
                endCursor: null
            };

            const originPostListOfNadoPost: String[] = [];
            

            while(true) {

                const tempPostsDto 
                    = await fetchPosts(
                        targetUserId,
                        filter,
                        tempPagination
                    );

                const resultPostPromises = tempPostsDto.postDocs.map(async (postDocument):Promise<PostDto> => {
                    if (postDocument.isNadoPost) {

                        const nado = await this.NadoService.getNadoById(postDocument.nadoId.toHexString());
                        console.log(postDocument._id);
                        originPostListOfNadoPost.push(nado.post._id.toHexString());
                        const originPost = await this.PostService.getPostDocumentById(nado.post._id.toHexString());
                        await originPost.populate('author');

                        return {
                            _id: originPost._id.toHexString(),
                            author: originPost.author,
                            content: originPost.content,
                            tags: originPost.tags,
                            category: originPost.category,
                            commentCount: originPost.commentCount,
                            isNadoPost: true,
                            isNadoed: true,
                            nadoer: await this.UserService.getUserByIdSafe(nado.nadoer._id.toHexString()),
                            nadoCount: originPost.nadoCount,
                            createdAt: originPost.createdAt.toISOString()
                        }
                    } else {
                        return this.PostAggregatorMapper.toPostDto(postDocument, requestUserId);
                    }
                })

                // 추가로 가져온 것 들 끼리만 비교하므로
                // 한번 순회한 이후부터는 거의 의미가 없을 듯
                // resultPosts를 쌓아놓은 것을 비교해야 함
                const resultPosts = await Promise.all(resultPostPromises);
                if (pagination.from === PaginationFrom.END) {
                    totalPosts.posts.push(...resultPosts);
                } else if (pagination.from === PaginationFrom.START) {
                    totalPosts.posts.unshift(...resultPosts);
                }

                const filteredPosts = totalPosts.posts.filter((post) => 
                    !originPostListOfNadoPost.includes(post._id) || post.isNadoPost
                );

                totalPosts.posts = [...filteredPosts];

                if (pagination.from === PaginationFrom.END) {
                    totalPosts.pageInfo = {
                        hasOverStart: totalPosts.pageInfo.hasOverStart ?? tempPostsDto.pageInfo.hasOverStart,
                        startCursor: totalPosts.pageInfo.startCursor ?? tempPostsDto.pageInfo.startCursor,
                        hasOverEnd: tempPostsDto.pageInfo.hasOverEnd,
                        endCursor: tempPostsDto.pageInfo.endCursor,
                        hasNext: tempPostsDto.pageInfo.hasNext
                    }
                } else if (pagination.from === PaginationFrom.START) {
                    totalPosts.pageInfo = {
                        hasOverStart: tempPostsDto.pageInfo.hasOverStart,
                        startCursor: tempPostsDto.pageInfo.startCursor,
                        hasOverEnd: totalPosts.pageInfo.hasOverEnd ?? tempPostsDto.pageInfo.hasOverEnd,
                        endCursor: totalPosts.pageInfo.endCursor ?? tempPostsDto.pageInfo.endCursor,
                        hasNext: tempPostsDto.pageInfo.hasNext
                    }
                }

                if (totalPosts.posts.length >= pagination.limit || totalPosts.pageInfo.hasNext === false) {
                    break;
                }

                tempPagination.cursor = pagination.from === PaginationFrom.END 
                    ? totalPosts.pageInfo.endCursor
                    : totalPosts.pageInfo.startCursor;
                    
                tempPagination.limit = pagination.limit - totalPosts.posts.length;
            }

            return totalPosts;

        } catch (err) {
            console.error(err);
        }
    }
}
