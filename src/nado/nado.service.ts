import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationService } from 'src/pagination/pagination.service';
import { UserService } from 'src/user/user.service';
import { Nado } from './schemas/nado.schema';
import { Model } from 'mongoose';
import { PostService } from 'src/post/post.service';
import { NadoDto } from './dto/nado.dto';
import { NadoMapper } from './mapper/nado.mapper';

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

            const createdNadoDocument = new this.NadoModel({
                nadoer: userId,
                post: targetPostId,
            })
            await createdNadoDocument.save();

            const nadoResult = await createdNadoDocument.populate('nadoer');

            return this.NadoMapper.toNadoDto(nadoResult);

        } catch (err) {
            console.error(err);
        }
    }
}