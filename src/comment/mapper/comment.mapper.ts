import { Injectable } from "@nestjs/common";
import { CommentDto } from "../dto/comment.dto";
import { CommentDocument } from "../schemas/comment.schema";
import { UserSafeDto } from "src/user/dto/user.dto";

export class CommentMapper {
    static toCommentDto(comment: CommentDocument, commenter: UserSafeDto): CommentDto {
        return {
            _id: comment._id.toString(),
            content: comment.content,
            postId: comment.post._id.toString(),
            commenter,
            createdAt: comment.createdAt.toISOString()
        }
    }
}