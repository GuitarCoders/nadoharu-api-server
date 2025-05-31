import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';
import { addCommentDto, CommentDto, CommentsDto, deleteCommentResultDto } from './dto/comment.dto';
import { Comment } from './schemas/comment.schema';
import { CommentMapper } from './mapper/comment.mapper';
import { PaginationTimeInput } from 'src/pagination/dto/pagination.dto';
import { PaginationService } from 'src/pagination/pagination.service';
import { PageBoundaryType, } from 'src/pagination/enum/pagination.enum';

@Injectable()
export class CommentService{
    constructor(
        private readonly UserService: UserService,
        private readonly PostService: PostService,
        private readonly PaginationService: PaginationService,
        @InjectModel(Comment.name) private CommentModel: Model<Comment>
    ) {}

    async addCommentToPost(commenterUserId: string, addData: addCommentDto): Promise<CommentDto>{
        try {

            const targetPost = await this.PostService.getPostDocumentById(addData.targetPostId);
            if(!targetPost) throw new Error("댓글을 작성할 대상 글이 존재하지 않습니다.");
            const createdComment = new this.CommentModel({
                content: addData.content,
                post: addData.targetPostId,
                commenter: commenterUserId,
            })
    
            await createdComment.save();
            await createdComment.populate('commenter');

            const resultComment = CommentMapper.toCommentDto(
                createdComment,
                this.UserService.userDocumentToUserSafe(createdComment.commenter)
            );
    
            return resultComment

        } catch (err) {
            console.error(err);
        }
        
    }

    async getCommentsByPostId(targetPostId: string, pagination: PaginationTimeInput): Promise<CommentsDto>{
        try {
            // const commentDocuments = await this.CommentModel.find({post: targetPostId}).sort({createdAt: 1}).populate('commenter');

            const commentQuery = this.CommentModel.find({post: targetPostId}).sort({createdAt: 1});
            
            const {countOnlyQuery} = this.PaginationService.buildPaginationQuery(pagination, commentQuery);

            const count = await countOnlyQuery.count();
            const commentDocuments = await commentQuery.populate('commenter');
    
            const commentArray = commentDocuments.map(item => (
                CommentMapper.toCommentDto(
                    item,
                    this.UserService.userDocumentToUserSafe(item.commenter)
                )
            ));

            return {
                comments: commentArray,
                pageInfo: this.PaginationService.getPageTimeInfo(
                    commentArray.at(-1).createdAt,
                    count, commentDocuments.length
                )
            };
        } catch (err) {
            console.error(err);
        }
    }

    async deleteCommentById(targetCommentId: string, requestUserId: string): Promise<deleteCommentResultDto>{
        try{
            const targetCommentDocument = await this.CommentModel.findById(targetCommentId);
            if(targetCommentDocument.commenter._id.toString() !== requestUserId){
                throw new Error("댓글 작성자와 삭제 요청자가 일치하지 않습니다.")
            }

            await targetCommentDocument.delete();

            return {success: true}
        } catch (err) {
            console.error(err);
        }
    }

    async getCommentsCount(targetPostId: string): Promise<number>{
        try{
            const commentCount = await this.CommentModel.find({post: targetPostId}).count();

            return commentCount;
        } catch (err) {
            console.error(err);
        }
    }
}
