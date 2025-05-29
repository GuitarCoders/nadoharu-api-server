import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { CommentService } from 'src/comment/comment.service';
import { FriendService } from 'src/friend/friend.service';
import { UserService } from 'src/user/user.service';
import { CreatePostDto, CreatePostResultDto, DeletePostDto, DeletePostResultDto, GetPostsResultDto, PostDto, PostFilterInput } from './dto/post.dto';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostService implements OnModuleInit {
    private commentService: CommentService;
    constructor(
        private friendService: FriendService,
        private moduleRef: ModuleRef,
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

    
    async getPosts(userId: string, filter: PostFilterInput, targetUserId?:string): Promise<GetPostsResultDto>{
        try {
            const friends = (await this.friendService.getFriendDocuments(userId)).map(item => {
                console.log(item.friend._id.toString());
                return item.friend._id.toString();
            });
            console.log(friends);
            const inQueryModel = this.PostModel.find({});

            if ( targetUserId ){
                inQueryModel.where('author').equals(targetUserId);
                if ( filter.category ){
                    inQueryModel.where('category').equals(filter.category);
                }
            } else {
                inQueryModel.where('author').in([userId, ...friends]);
            }

            if( filter.before){
                inQueryModel.lt('createdAt', filter.before);
            }

            const leftCount = await (new (inQueryModel.toConstructor())).count();

            const resultPostModels = await inQueryModel.sort({createdAt: -1}).limit(filter.limit).populate('author');
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
                lastDateTime: lastDateTime,
                hasNext: (leftCount > filter.limit)
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
