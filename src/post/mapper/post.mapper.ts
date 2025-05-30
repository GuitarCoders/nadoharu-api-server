import { PostDto, PostsQueryResultDto } from "../dto/post.dto";
import { PostDocument } from "../schemas/post.schema";

export class PostMapper {
    static toPostDto(Post: PostDocument): PostDto {
        return {
            _id: Post._id.toString(),
            author: Post.author,
            content: Post.content,
            tags: Post.tags,
            category: Post.category,
            createdAt: Post.createdAt.toISOString()
        }
    }
}