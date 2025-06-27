import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { NadoDocument } from "../schemas/nado.schema";
import { NadoDto } from "../dto/nado.dto";

@Injectable()
export class NadoMapper {
    constructor (
        private readonly UserService: UserService
    ) {}

    toNadoDto(nadoDoc: NadoDocument): NadoDto {
        return {
            _id: nadoDoc._id.toHexString(),
            nadoer: this.UserService.userDocumentToUserSafe(nadoDoc.nadoer),
            postId: nadoDoc.post._id.toHexString(),
            createdAt: nadoDoc.createdAt.toISOString()
        }
    }
}