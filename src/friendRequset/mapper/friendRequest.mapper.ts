import { UserSafeDto } from "src/user/dto/user.dto";
import { FriendRequestDocument } from "../schemas/friendRequest.schema";
import { FriendRequestDto } from "../dto/friendRequest.dto";
import { UserService } from "src/user/user.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FriendRequestMapper {
    constructor(
        private readonly UserService: UserService
    ) {}

    toFriendRequestDto(
        friendRequest: FriendRequestDocument,
    ): FriendRequestDto {

        const requesterSafe = this.UserService.userDocumentToUserSafe(friendRequest.requester);
        const receiverSafe = this.UserService.userDocumentToUserSafe(friendRequest.receiver);

        return {
            _id: friendRequest._id.toString(),
            requester: requesterSafe,
            receiver: receiverSafe,
            requestMessage: friendRequest.requestMessage,
            createdAt: friendRequest.createdAt.toISOString()
        }
    }
}