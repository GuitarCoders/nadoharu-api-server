import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { CreatePostDto, CreatePostResultDto, DeletePostDto, DeletePostResultDto, GetPostsDto, GetPostsResultDto, PostDto, Test } from './dto/post.dto';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostService {
    constructor(
        private userService: UserService,
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

    /** @Deprecated getPosts가 해당 함수의 기능을 포함합니다. */
    //TODO : Friends 기능이 완성되면 해당 코드 수정
    // async getPostsForTimeline(userId: string, data: GetPostsDto): Promise<GetPostsResultDto>{
    //     try{
    //         const user = await this.userService.getUserById(userId);
    //         const friends = user.friends;
    //         const resultPosts = await this.PostModel
    //             .find({})
    //             .where('author')
    //             .in([user._id, ...friends])
    //             .sort({createdAt: -1})
    //             .populate('author');

    //         const result: PostDto[] = []
    //         resultPosts.forEach(item => {
    //             result.push({
    //                 _id: item._id.toString(),
    //                 author: item.author,
    //                 content: item.content,
    //                 category: item.category,
    //                 createdAt: item.createdAt.toISOString()
    //             })
    //         })

    //         const lastDateTime = resultPosts.at(0).createdAt.toISOString();

    //         return {
    //             posts: result,
    //             lastDateTime: lastDateTime
    //         }
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }

    async getPosts(userId: string, data: GetPostsDto): Promise<GetPostsResultDto>{
        try {
            const friends = (await this.userService.getUserById(userId));
            const inQueryModel = this.PostModel.find({});

            if ( data.filter?.userId ){
                inQueryModel.where('author').equals(data.filter.userId);
                if ( data.filter.category ){
                    inQueryModel.where('category').equals(data.filter.category);
                }
            } else {
                inQueryModel.where('author').in([userId]);
            }

            if( data.filter?.before){
                inQueryModel.lt('createdAt', data.filter.before);
            }

            const resultPostModels = await inQueryModel.sort({createdAt: -1}).limit(data.count).populate('author');
            const result: PostDto[] = []
            resultPostModels.forEach(item => {
                result.push({
                    _id: item._id.toString(),
                    author: item.author,
                    content: item.content,
                    tags: item.tags,
                    category: item.category,
                    createdAt: item.createdAt.toISOString()
                })
            })
            console.log(result);

            return { posts:result, lastDateTime: resultPostModels.at(-1).createdAt.toISOString() };
        } catch (err) {
            console.error(err);
        }
    }

    async createPost(
        userId: string, 
        data: CreatePostDto
    ): Promise<CreatePostResultDto>{
        try{
            const createdPost = new this.PostModel({
                author: userId,
                content: data.content,
                tags: data.tags,
                category: data.category
            })

            await createdPost.save();

            const createdPostResult = await createdPost.populate('author');
            return {
                _id: createdPostResult._id.toString(),
                content: createdPostResult.content,
                tags: createdPostResult.tags,
                category: createdPostResult.category,
                author: createdPostResult.author,
                createdAt: createdPostResult.createdAt.toISOString(),
                success: true,
            }
        } catch (err) {
            console.log(err);
        }
    }

    async deletePost(
        userId: string,
        data: DeletePostDto
    ): Promise<DeletePostResultDto> {
        try{
            const targetPostModel = await this.PostModel.findById(data.postId).populate('author');
            if(targetPostModel.author._id.toString() != userId){
                throw new Error("본인의 글만 삭제할 수 있습니다.");
            }
            await targetPostModel.deleteOne();

            return {success: true}
        } catch (err) {
            console.error(err);
        }
    }
}
