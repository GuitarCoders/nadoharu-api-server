import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query, Types } from 'mongoose';
import { CommentService } from 'src/comment/comment.service';
import { FriendService } from 'src/friend/friend.service';
import { UserService } from 'src/user/user.service';
import { CreatePostDto, CreatePostResultDto, DeletePostResultDto, PostsQueryResultDto, PostDto, PostFilterInput } from './dto/post.dto';
import { Post, PostDocument } from './schemas/post.schema';
import { PageInfo, PaginationInput } from 'src/pagination/dto/pagination.dto';
import { GraphQLError } from 'graphql';
import { PaginationService } from 'src/pagination/pagination.service';
import { PostMapper } from './mapper/post.mapper';

@Injectable()
export class PostService{
    constructor(
        private FriendService: FriendService,
        private PaginationService: PaginationService,
        private PostMapper: PostMapper,
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
            return this.PostMapper.toPostDto(result);
        } catch (err) {
            console.error(err);
        }
    }
    
    async getPostDocumentsByUserId(
        targetUserId: string,
        filter: PostFilterInput,
        pagination: PaginationInput
    ): Promise<{postDocs:PostDocument[], pageInfo:PageInfo}> {
        try {
            const postsQuery = this.PostModel.find({author: targetUserId}).sort({createdAt: -1});

            if (filter.category) {
                postsQuery.where('category', filter.category);
            }
            postsQuery.populate('author');
            
            const {
                paginatedDoc: postDocuments,
                pageInfo
            } = await this.PaginationService.getPaginatedDocuments(pagination, postsQuery)

            return {postDocs:postDocuments, pageInfo};
        } catch (err) {
            if (err instanceof GraphQLError) {
                throw err;
            }
            console.error(err);
        }
    }
        
    async getPostsByUserId(
        targetUserId: string,
        filter: PostFilterInput,
        pagination: PaginationInput
    ): Promise<PostsQueryResultDto> {
        try {
            const {
                postDocs: postDocuments, 
                pageInfo
            } = await this.getPostDocumentsByUserId(targetUserId, filter, pagination);

            const posts = postDocuments.map(item => this.PostMapper.toPostDto(item));

            return {posts: posts, pageInfo};
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
    ): Promise<PostsQueryResultDto> {
        try {
            const {
                postDocs,
                pageInfo
            } = await this.getPostDocumentsForTimeline(userId, pagination);

            const posts = postDocs.map(item => this.PostMapper.toPostDto(item));

            return {posts, pageInfo};
        } catch (err) {
            console.error(err);
        }
    }

    async getPostDocumentsForTimeline(
        userId: string, 
        pagination: PaginationInput
    ): Promise<{postDocs: PostDocument[], pageInfo: PageInfo}>{
        try {
            const friends = (await this.FriendService.getFriendDocuments(userId)).map(item => {
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
                paginatedDoc: resultPostDocuments,
                pageInfo
            } = await this.PaginationService.getPaginatedDocuments(pagination, postsQuery)

            return { postDocs: resultPostDocuments, pageInfo: pageInfo};
        } catch (err) {
            console.error(err);
        }
    }

    async createPost(
        userId: string, 
        data: CreatePostDto
    ): Promise<CreatePostResultDto> {
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
                post: this.PostMapper.toPostDto(createdPostResult),
                success: true,
            }
        } catch (err) {
            console.log(err);
        }
    }

    async createNadoPost(
        nadoerId: string,
        nadoId: Types.ObjectId
    ):Promise<boolean> {
        try {
            const createdPost = new this.PostModel({
                author: nadoerId,
                content: "nado",
                isNadoPost: true,
                nadoId: nadoId,
                nadoCount: 0
            });

            await createdPost.save();

            return true;
        } catch (err) {
            console.error(err);
        }
    }

    async addNadoCount(
        originPostId: string,
    ):Promise<boolean> {
        try {
            const originPostDocument = await this.getPostDocumentById(originPostId);

            if (!originPostDocument) {
                throw new Error("해당 게시글이 존재하지 않습니다.");
            }

            originPostDocument.nadoCount += 1;
            await originPostDocument.save();

            return true;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async subNadoCount(
        originPostId: string,
    ):Promise<boolean> {
        try {
            const originPostDocument = await this.getPostDocumentById(originPostId);

            if (!originPostDocument) {
                throw new Error("해당 게시글이 존재하지 않습니다.");
            }

            originPostDocument.nadoCount -= 1;
            await originPostDocument.save();

            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async addCommentCount(
        postId: string
    ): Promise<boolean> {
        try {
            const postDocument = await this.getPostDocumentById(postId);

            if (!postDocument) {
                throw new Error("해당 게시글이 존재하지 않습니다.");
            }

            postDocument.commentCount += 1;
            await postDocument.save();

            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async subCommentCount(
        postId: string
    ): Promise<boolean> {
        try {
            const postDocument = await this.getPostDocumentById(postId);

            if (!postDocument) {
                throw new Error("해당 게시글이 존재하지 않습니다.");
            }

            postDocument.commentCount -= 1;
            await postDocument.save();

            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async deletePost(
        userId: string,
        postId: string
    ): Promise<DeletePostResultDto> {
        try{
            const targetPostDocument = await this.PostModel.findById(postId).populate('author');
            if(targetPostDocument.author._id.toString() != userId){
                throw new Error("본인의 글만 삭제할 수 있습니다.");
            }
            await targetPostDocument.deleteOne();

            return {success: true}
        } catch (err) {
            console.error(err);
        }
    }

    async deleteNadoPostByNadoId(
        userId: string,
        nadoId: string,
    ): Promise<boolean> {
        try {
            const targetPostDocument = await this.PostModel.findOne({nadoId});
            if(targetPostDocument.author._id.toHexString() != userId) {
                throw new Error("본인의 글만 삭제할 수 있습니다.")
            }
            await targetPostDocument.deleteOne();

            return true
        } catch (err) {
            console.error(err);
        }
    }
}
