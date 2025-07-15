import { Injectable } from "@nestjs/common";
import { PostDto, PostsQueryResultDto } from "../../dto/post.dto";
import { PostDocument } from "../../schemas/post.schema";
import { NadoService } from "src/nado/nado.service";
import { UserService } from "src/user/user.service";
import { PaginationInput } from "src/pagination/dto/pagination.dto";
import { AggregatedPostDto } from "../dto/post-aggregator.dto";

@Injectable()
export class PostAggregatorMapper {
    constructor (
        private readonly NadoService: NadoService,
        private readonly UserService: UserService
    ) {}

    async toPostDto(
        post: PostDocument, 
        requestingUserId: string, 
        nadoUsersPagination: PaginationInput
    ): Promise<AggregatedPostDto> {
        
        return {
            _id: post._id.toString(),
            author: post.author,
            content: post.content,
            tags: post.tags,
            category: post.category,
            commentCount: post.commentCount,
            isNadoPost: post.isNadoPost,
            isNadoed: await this.NadoService.isNadoedByUserAndPostId(requestingUserId, post._id.toHexString()),
            nadoUsers: 
                nadoUsersPagination 
                ? await this.NadoService.getNadoUsersByPostId(post._id.toHexString(), nadoUsersPagination)
                : null,
            nadoCount: post.nadoCount,
            createdAt: post.createdAt.toISOString()
        }
    }

    async toPostDtoFromNadoPost(
        originPost: PostDocument, 
        requestUserId: string,
        nadoUserId: string,
        nadoUsersPagination: PaginationInput
    ): Promise<AggregatedPostDto> {

        return {
            _id: originPost._id.toHexString(),
            author: originPost.author,
            content: originPost.content,
            tags: originPost.tags,
            category: originPost.category,
            commentCount: originPost.commentCount,
            isNadoPost: true,
            isNadoed: await this.NadoService.isNadoedByUserAndPostId(requestUserId, originPost._id.toHexString()),
            nadoer: await this.UserService.getUserByIdSafe(nadoUserId),
            nadoUsers: 
                nadoUsersPagination 
                ? await this.NadoService.getNadoUsersByPostId(originPost._id.toHexString(), nadoUsersPagination)
                : null,
            nadoCount: originPost.nadoCount,
            createdAt: originPost.createdAt.toISOString()
        }
    }
}