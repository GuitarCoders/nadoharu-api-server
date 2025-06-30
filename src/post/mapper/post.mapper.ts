import { PostDto, PostsQueryResultDto } from "../dto/post.dto";
import { PostDocument } from "../schemas/post.schema";

export class PostMapper {
    static toPostDto(post: PostDocument): PostDto {
        return {
            _id: post._id.toString(),
            author: post.author,
            content: post.content,
            tags: post.tags,
            category: post.category,
            isNadoPost: post.isNadoPost,
            nadoCount: post.nadoCount,
            createdAt: post.createdAt.toISOString()
        }
    }
}