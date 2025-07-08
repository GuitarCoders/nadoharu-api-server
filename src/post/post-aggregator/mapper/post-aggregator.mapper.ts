import { Injectable } from "@nestjs/common";
import { PostDto, PostsQueryResultDto } from "../../dto/post.dto";
import { PostDocument } from "../../schemas/post.schema";
import { NadoService } from "src/nado/nado.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class PostAggregatorMapper {
    constructor (
        private readonly NadoService: NadoService,
        private readonly UserService: UserService
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

    async toPostDtoFromNadoPost(originPost: PostDocument, requestUserId: string): Promise<PostDto> {

        return {
            _id: originPost._id.toHexString(),
            author: originPost.author,
            content: originPost.content,
            tags: originPost.tags,
            category: originPost.category,
            commentCount: originPost.commentCount,
            isNadoPost: true,
            isNadoed: await this.NadoService.isNadoedByUserAndPostId(requestUserId, originPost._id.toHexString()),
            nadoer: await this.UserService.getUserByIdSafe(requestUserId),
            nadoCount: originPost.nadoCount,
            createdAt: originPost.createdAt.toISOString()
        }
    }
}