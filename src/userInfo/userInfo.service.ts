import { Injectable } from "@nestjs/common";
import { FriendService } from "src/friend/friend.service";
import { UserService } from "src/user/user.service";
import { UserInfoDto } from "./dto/userInfo.dto";

@Injectable()
export class UserInfoService {
    constructor (
        private UserService: UserService,
        private FriendService: FriendService
    ) {}

    async getUserInfo(
        requestUserId: string, 
        targetUserId: string
    ): Promise<UserInfoDto>{
        try {
            const targetUser = await this.UserService.getUserByIdSafe(targetUserId);
            const isFriend = await this.FriendService.checkFriend(requestUserId, targetUserId);
            
            return {
                user: targetUser,
                isFriend
            }
            
        } catch (err) {
            console.error(err);
        }
    }
}