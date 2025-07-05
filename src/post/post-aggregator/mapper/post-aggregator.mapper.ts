import { Injectable } from "@nestjs/common";
import { PostDto, PostsQueryResultDto } from "../../dto/post.dto";
import { PostDocument } from "../../schemas/post.schema";
import { NadoService } from "src/nado/nado.service";

@Injectable()
export class PostAggregatorMapper {
    constructor (
        private readonly NadoService: NadoService
    ) {}
    async toPostDto(post: PostDocument, requestingUserId: string): Promise<PostDto> {
        
        return {
            _id: post._id.toString(),
            author: post.author,
            content: post.content,
            tags: post.tags,
            category: post.category,
            commentCount: post.commentCount,
            isNadoPost: post.isNadoPost,
            isNadoed: await this.NadoService.isNadoedByUserAndPostId(requestingUserId, post._id.toHexString()),
            nadoCount: post.nadoCount,
            createdAt: post.createdAt.toISOString()
        }
    }
}