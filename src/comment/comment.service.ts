import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';
import { addCommentDto, CommentDto } from './dto/comment.dto';
import { Comment } from './schemas/comment.schema';

@Injectable()
export class CommentService {
    constructor(
        private readonly UserService: UserService,
        private readonly PostService: PostService,
        @InjectModel(Comment.name) private CommentModel: Model<Comment>
    ) {}

    async addCommentToPost(commenterUserId: string, addData: addCommentDto): Promise<CommentDto>{
        const targetPost = await this.PostService.getPostById(addData.targetPostId);
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
        
    }
}
