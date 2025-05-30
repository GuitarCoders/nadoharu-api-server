import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query, Types } from 'mongoose';
import { CommentService } from 'src/comment/comment.service';
import { FriendService } from 'src/friend/friend.service';
import { UserService } from 'src/user/user.service';
import { CreatePostDto, CreatePostResultDto, DeletePostDto, DeletePostResultDto, PostsQueryResultDto, PostDto, PostFilterInput } from './dto/post.dto';
import { Post, PostDocument } from './schemas/post.schema';
import { PaginationTimeInput } from 'src/pagination/dto/pagination.dto';
import { PageBoundaryType, PaginationDirection } from 'src/pagination/enum/pagination.enum';
import { GraphQLError } from 'graphql';
import { PaginationService } from 'src/pagination/pagination.service';

@Injectable()
export class PostService implements OnModuleInit {
    private commentService: CommentService;
    constructor(
        private friendService: FriendService,
        private moduleRef: ModuleRef,
        private paginationService: PaginationService,
        @InjectModel(Post.name) private PostModel: Model<Post>
    ){}

    onModuleInit() {
        this.commentService = this.moduleRef.get(CommentService, {strict: false});
    }

    async getPostDocumentById(postId: string): Promise<PostDocument>{
        try{
            const result = await this.PostModel.findById(postId);
            return result;
        } catch (err) {
            console.error(err);
        }
    }

    async getPostById(postId: string): Promise<PostDto>{
        try{
            const result = await this.getPostDocumentById(postId)
            console.log(result);
            return {
                _id: result._id.toString(),
                content: result.content,
                tags: result.tags,
                category: result.category,
                author: (await result.populate('author')).author,
                commentsCount: await this.commentService.getCommentsCount(result._id.toString()),
                createdAt: result.createdAt.toISOString()
            }
        } catch (err) {
            console.error(err);
        }
    }


    async getPostsByUserId(
        targetUserId: string,
        filter: PostFilterInput,
        pagination: PaginationTimeInput
    ): Promise<PostsQueryResultDto> {
        try {
            const postsQuery = this.PostModel.find({author: targetUserId}).sort({createdAt: -1});

            if (filter.category) {
                postsQuery.where('category', filter.category);
            }

            const {countOnlyQuery: countQuery} 
                = this.paginationService.buildPaginationQuery(pagination, postsQuery)

            const docsCount = await countQuery.count();

            postsQuery
                .populate('author');
            
            const postDocuments = await postsQuery;
            const posts = await Promise.all(
                postDocuments.map(async item => ({
                    _id: item._id.toString(),
                    author: item.author,
                    content: item.content,
                    tags: item.tags,
                    category: item.category,
                    commentsCount: await this.commentService.getCommentsCount(item._id.toString()),
                    createdAt: item.createdAt.toISOString()
                }))
            )

            const lastDateTime = postDocuments.at(-1)?.createdAt.toISOString();

            return {
                posts: posts,
                pageInfo: {
                    timeCursor: lastDateTime,
                    boundaryType: PageBoundaryType.OLDEST,
                    hasNext: docsCount > postDocuments.length
                }
            };
        } catch (err) {
            if (err instanceof GraphQLError) {
                throw err;
            }
            console.error(err);
        }
    }
    
    async getPostsForTimeline(
        userId: string, 
        filter: PostFilterInput, 
        pagination: PaginationTimeInput
    ): Promise<PostsQueryResultDto>{
        try {
            const friends = (await this.friendService.getFriendDocuments(userId)).map(item => {
                console.log(item.friend._id.toString());
                return item.friend._id.toString();
            });
            console.log(friends);
            const inQueryModel = this.PostModel.find({});

            inQueryModel.where('author').in([userId, ...friends]);


            if( pagination.timeCursor ){
                inQueryModel.lt('createdAt', pagination.timeCursor);
            }

            const leftCount = await (new (inQueryModel.toConstructor())).count();

            const resultPostModels = await inQueryModel.sort({createdAt: -1}).limit(pagination.limit).populate('author');
            const result: PostDto[] = await Promise.all(resultPostModels.map( async item => {
                return {
                    _id: item._id.toString(),
                    author: item.author,
                    content: item.content,
                    tags: item.tags,
                    category: item.category,
                    commentsCount: await this.commentService.getCommentsCount(item._id.toString()),
                    createdAt: item.createdAt.toISOString()
                }
            }));

            const lastDateTime = resultPostModels.at(-1)?.createdAt.toISOString();

            return { 
                posts:result, 
                pageInfo: {
                    timeCursor: lastDateTime,
                    boundaryType: PageBoundaryType.OLDEST,
                    hasNext: (leftCount > pagination.limit)
                }
            };
        } catch (err) {
            console.error(err);
        }
    }

    async createPost(
        userId: string, 
        data: CreatePostDto
    ): Promise<CreatePostResultDto>{
        try{
            const createdPost = new this.PostModel({
                author: userId,
                content: data.content,
                tags: data.tags,
                category: data.category
            })

            await createdPost.save();

            const createdPostResult = await createdPost.populate('author');
            return {
                _id: createdPostResult._id.toString(),
                content: createdPostResult.content,
                tags: createdPostResult.tags,
                category: createdPostResult.category,
                author: createdPostResult.author,
                createdAt: createdPostResult.createdAt.toISOString(),
                commentsCount: 0,
                success: true,
            }
        } catch (err) {
            console.log(err);
        }
    }

    async deletePost(
        userId: string,
        data: DeletePostDto
    ): Promise<DeletePostResultDto> {
        try{
            const targetPostModel = await this.PostModel.findById(data.postId).populate('author');
            if(targetPostModel.author._id.toString() != userId){
                throw new Error("본인의 글만 삭제할 수 있습니다.");
            }
            await targetPostModel.deleteOne();

            return {success: true}
        } catch (err) {
            console.error(err);
        }
    }
}
