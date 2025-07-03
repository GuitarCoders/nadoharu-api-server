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
            originPostId: nadoDoc.post._id.toHexString()
        }
    }
}