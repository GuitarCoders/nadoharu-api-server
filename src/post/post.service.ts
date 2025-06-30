import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query, Types } from 'mongoose';
import { CommentService } from 'src/comment/comment.service';
import { FriendService } from 'src/friend/friend.service';
import { UserService } from 'src/user/user.service';
import { CreatePostDto, CreatePostResultDto, DeletePostResultDto, PostsQueryResultDto, PostDto, PostFilterInput } from './dto/post.dto';
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
            const postDocument = await this.getPostDocumentById(postId)
            const result = await postDocument.populate('author');
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
            postsQuery.populate('author');
            
            const {
                paginatedDoc: postDocuments,
                pageInfo
            } = await this.paginationService.getPaginatedDocuments(pagination, postsQuery)
            
            const posts = postDocuments.map(item => PostMapper.toPostDto(item));

            return {
                posts: posts,
                pageInfo
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
                    .sort({createdAt: -1})
                    .populate('author');

            const {
                paginatedDoc: resultPostModels,
                pageInfo
            } = await this.paginationService.getPaginatedDocuments(pagination, postsQuery)
            const result = resultPostModels.map(item => PostMapper.toPostDto(item));

            return { 
                posts:result, 
                pageInfo
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
                category: data.category,
                isNadoPost: false,
                nadoCount: 0
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
        postId: string
    ): Promise<DeletePostResultDto> {
        try{
            const targetPostModel = await this.PostModel.findById(postId).populate('author');
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
