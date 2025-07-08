import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationService } from 'src/pagination/pagination.service';
import { UserService } from 'src/user/user.service';
import { Nado, NadoDocument } from './schemas/nado.schema';
import { Model } from 'mongoose';
import { PostService } from 'src/post/post.service';
import { NadoCancelResultDto, NadoDto, NadoUsersDto } from './dto/nado.dto';
import { NadoMapper } from './mapper/nado.mapper';
import { NadoharuGraphQLError } from 'src/errors/nadoharuGraphQLError';
import { PaginationInput } from 'src/pagination/dto/pagination.dto';

@Injectable()
export class NadoService {
    constructor(
        private readonly NadoMapper: NadoMapper,
        private readonly UserService: UserService,
        private readonly PostService: PostService,
        private readonly PaginationService: PaginationService,
        @InjectModel(Nado.name) private readonly NadoModel: Model<Nado>
    ){}

    async getNadoUsersByPostId(
        postId: string, pagination: PaginationInput
    ): Promise<NadoUsersDto> {
        try {
            const nadoQuery = this.NadoModel.find({post: postId});
            nadoQuery.populate('nadoer');

            const {
                paginatedDoc: nadoDocuments, 
                pageInfo
            } = await this.PaginationService.getPaginatedDocuments(pagination, nadoQuery);

            const nadoUsers = nadoDocuments.map(
                nado => this.UserService.userDocumentToUserSafe(nado.nadoer)
            );

            return { users: nadoUsers, pageInfo }

        } catch (err) {
            console.error(err);
        }
    }

    async addNado(
        userId: string, targetPostId: string
    ): Promise<NadoDto> {
        try {
            const userDocument = await this.UserService.getUserByIdSafe(userId);
            if (!userDocument) {
                throw new Error('해당 유저가 존재하지 않습니다.');
            }

            const postDocument = await this.PostService.getPostDocumentById(targetPostId);
            if (!postDocument) { 
                throw new Error('해당 게시글이 존재하지 않습니다.');
            }
            if (postDocument.isNadoPost) {
                throw new Error('나도 더미 게시글은 나도를 할 수 없습니다.');
            }

            const createdNadoDocument = new this.NadoModel({
                nadoer: userId,
                post: targetPostId,
            })
            await createdNadoDocument.save();

            await this.PostService.createNadoPost(userId, createdNadoDocument._id);
            await this.PostService.addNadoCount(targetPostId);

            const nadoResult = await createdNadoDocument.populate('nadoer');

            return this.NadoMapper.toNadoDto(nadoResult);

        } catch (err) {
            if (err.code === 11000) { // MongoDB unique 제약조건 에러 코드
                throw new NadoharuGraphQLError('ALREADY_NADOED_POST');
            }
            console.error(err);
        }
    }
    
    async getNadoById(nadoId: string): Promise<NadoDocument> {
        try {
            return await this.NadoModel.findById(nadoId);
        } catch (err) {
            console.error(err);
        }
    }

    async isNadoedByUserAndPostId(
        userId: string, 
        postId: string
    ): Promise<boolean> {
        try {
            const existNadoDoc = await this.NadoModel.find({
                nadoer: userId,
                post: postId
            })

            if (existNadoDoc.length !== 0) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error(err);
        }
    }

    async cancelNado(userId: string, targetPostId: string): Promise<NadoCancelResultDto> {
        try {
            const userDocument = await this.UserService.getUserByIdSafe(userId);
            if (!userDocument) {
                throw new Error('해당 유저가 존재하지 않습니다.');
            }

            const postDocument = await this.PostService.getPostDocumentById(targetPostId);
            if (!postDocument) { 
                throw new Error('해당 게시글이 존재하지 않습니다.');
            }

            const nadoDocument = await this.NadoModel.findOne({
                nadoer: userDocument._id,
                post: postDocument._id
            });
            if (!nadoDocument) {
                throw new Error('해당 게시글에 나도 표현을 하지 않았습니다.');
            }

            await this.PostService.deleteNadoPostByNadoId(userId, nadoDocument._id.toHexString());
            await this.PostService.subNadoCount(postDocument._id.toHexString());
            await nadoDocument.deleteOne();

            return {success: true}
        } catch (err) {
            console.error(err);
        }
    }
}