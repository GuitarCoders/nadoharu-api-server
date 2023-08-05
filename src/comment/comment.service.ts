import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';
import { addCommentDto, CommentDto, commentFilter, CommentsDto, deleteCommentResultDto } from './dto/comment.dto';
import { Comment } from './schemas/comment.schema';

@Injectable()
export class CommentService {
    constructor(
        private readonly UserService: UserService,
        private readonly PostService: PostService,
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
        
            const resultComment: CommentDto = {
                _id: createdComment._id.toString(),
                content: createdComment.content,
                postId: createdComment.post._id.toString(),
                Commenter: this.UserService.userDocumentToUserSafe((await createdComment.populate('commenter')).commenter),
                createdAt: createdComment.createdAt.toISOString()
            }
    
            return resultComment

        } catch (err) {
            console.error(err);
        }
        
    }

    async getCommentsByPostId(targetPostId: string, options: commentFilter): Promise<CommentsDto>{
        try {
            // const commentDocuments = await this.CommentModel.find({post: targetPostId}).sort({createdAt: 1}).populate('commenter');

            const commentCount = await this.CommentModel.find({post: targetPostId}).count();
            
            const commentQuery = this.CommentModel.find({post: targetPostId}).sort({createdAt: 1});
            if(options.skip) {
                commentQuery.skip(options.skip);
            }
            commentQuery.limit(options.limit);
            const commentDocuments = await commentQuery.populate('commenter');

            console.log(`commentCount: ${commentCount} | skip+limit: ${options.skip?options.skip:0+options.limit}`);
            
            const result: CommentDto[] = commentDocuments.map(item => ({
                _id: item._id.toString(),
                content: item.content,
                postId: item.post._id.toString(),
                Commenter: this.UserService.userDocumentToUserSafe(item.commenter),
                createdAt: item.createdAt.toISOString()
            }))
            return {
                comments: result,
                hasNext: commentCount > (options.skip?options.skip:0 + options.limit)
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
