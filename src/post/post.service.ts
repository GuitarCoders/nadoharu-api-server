import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query, Types } from 'mongoose';
import { CommentService } from 'src/comment/comment.service';
import { FriendService } from 'src/friend/friend.service';
import { UserService } from 'src/user/user.service';
import { CreatePostDto, CreatePostResultDto, DeletePostDto, DeletePostResultDto, PostsQueryResultDto, PostDto, PostFilterInput } from './dto/post.dto';
import { Post, PostDocument } from './schemas/post.schema';
import { PaginationInput } from 'src/pagination/dto/pagination.dto';
import { GraphQLError } from 'graphql';
import { PaginationService } from 'src/pagination/pagination.service';
import { PostMapper } from './mapper/post.mapper';

@Injectable()
export class PostService{
    constructor(
        private friendService: FriendService,
        private paginationService: PaginationService,
        @InjectModel(Post.name) private PostModel: Model<Post>
    ){}

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
            return PostMapper.toPostDto(result);
        } catch (err) {
            console.error(err);
        }
    }


    async getPostsByUserId(
        targetUserId: string,
        filter: PostFilterInput,
        pagination: PaginationInput
    ): Promise<PostsQueryResultDto> {
        try {
            const postsQuery = this.PostModel.find({author: targetUserId}).sort({createdAt: -1});

            if (filter.category) {
                postsQuery.where('category', filter.category);
            }

            const {countOnlyQuery} 
                = this.paginationService.buildPaginationQuery(pagination, postsQuery)

            const docsCount = await countOnlyQuery.count();

            postsQuery.populate('author');
            
            const postDocuments = await postsQuery;
            const posts = postDocuments.map(item => PostMapper.toPostDto(item));

            const lastDateTime = postDocuments.at(-1)?.createdAt.toISOString();

            return {
                posts: posts,
                pageInfo: this.paginationService.getPageTimeInfo(
                    postDocuments.at(-1),
                    docsCount, posts.length
                )
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
        pagination: PaginationInput
    ): Promise<PostsQueryResultDto>{
        try {
            const friends = (await this.friendService.getFriendDocuments(userId)).map(item => {
                console.log(item.friend._id.toString());
                return item.friend._id.toString();
            });
            const postsQuery 
                = this.PostModel
                    .find({})
                    .where('author').in([userId, ...friends])
                    .sort({createdAt: -1});

            const {countOnlyQuery} 
                = this.paginationService.buildPaginationQuery(pagination, postsQuery);

            const postsCount = await countOnlyQuery.count();

            const resultPostModels = await postsQuery.populate('author');
            const result = resultPostModels.map(item => PostMapper.toPostDto(item));

            return { 
                posts:result, 
                pageInfo: this.paginationService.getPageTimeInfo(
                    resultPostModels.at(-1),
                    postsCount, result.length
                )
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
                post: PostMapper.toPostDto(createdPostResult),
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
