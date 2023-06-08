import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto, CreatePostResultDto, GetPostsDto, GetPostsResultDto } from './dto/post.dto';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name) private PostModel: Model<Post>
    ){}

    async getPostById(postId: string): Promise<PostDocument>{
        try{
            const result = await this.PostModel.findById(postId);
            return result;
        } catch (err) {
            console.error(err);
        }
    }

    // async getPostForTimeline(data: GetPostsDto): Promise<GetPostsResultDto>{
    //     try{
    //         const resultPosts = await this.PostModel.find({})
    //     }
    // }

    async createPost(
        userId: string, 
        data: CreatePostDto
    ): Promise<CreatePostResultDto>{
        try{
            const createdPost = new this.PostModel({
                authorId: userId,
                content: data.content,
                tags: data.tags,
                category: data.category
            })

            await createdPost.save();

            return {
                _id: createdPost._id.toString(),
                content: createdPost.content,
                tags: createdPost.tags,
                category: createdPost.category,
                authorId: createdPost.authorId._id.toString(),
                createdAt: createdPost.createdAt.toISOString(),
                success: true
            }
        } catch (err) {
            console.log(err);
        }
    }
}
