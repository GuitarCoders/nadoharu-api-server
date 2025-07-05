import { Injectable } from "@nestjs/common";
import { PostDto, PostsQueryResultDto } from "../dto/post.dto";
import { PostDocument } from "../schemas/post.schema";

@Injectable()
export class PostMapper {
    toPostDto(post: PostDocument): PostDto {
        return {
            _id: post._id.toString(),
            author: post.author,
            content: post.content,
            tags: post.tags,
            category: post.category,
            commentCount: post.commentCount,
            isNadoPost: post.isNadoPost,
            isNadoed: false,
            nadoCount: post.nadoCount,
            createdAt: post.createdAt.toISOString()
        }
    }
}