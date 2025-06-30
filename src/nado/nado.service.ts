import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationService } from 'src/pagination/pagination.service';
import { UserService } from 'src/user/user.service';
import { Nado } from './schemas/nado.schema';
import { Model } from 'mongoose';
import { PostService } from 'src/post/post.service';
import { NadoDto } from './dto/nado.dto';
import { NadoMapper } from './mapper/nado.mapper';
import { NadoharuGraphQLError } from 'src/errors/nadoharuGraphQLError';

@Injectable()
export class NadoService {
    constructor(
        private readonly NadoMapper: NadoMapper,
        private readonly UserService: UserService,
        private readonly PostService: PostService,
        private readonly PaginationService: PaginationService,
        @InjectModel(Nado.name) private readonly NadoModel: Model<Nado>
    ){}

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
}