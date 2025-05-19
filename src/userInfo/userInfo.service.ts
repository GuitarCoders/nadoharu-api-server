import { Injectable } from "@nestjs/common";
import { FriendService } from "src/friend/friend.service";
import { UserService } from "src/user/user.service";
import { UserInfoDto, UserInfosDto } from "./dto/userInfo.dto";
import { FriendState } from "./enums/userInfo.enum";

@Injectable()
export class UserInfoService {
    constructor (
        private UserService: UserService,
        private FriendService: FriendService
    ) {}

    async getUserInfos(
        requestUserId: string,
        search: string
    ): Promise<UserInfosDto> {
        try {
            const users = await this.UserService.findUsers(search);
            const userInfoPromises: Promise<UserInfoDto>[] = users.Users.map(async(user) => {
                const isFriend = await this.getFriendState(requestUserId, user._id);
                const friendCount = await this.FriendService.getFriendCount(user._id);
                return {
                    user,
                    isFriend,
                    friendCount
                }
            });
            const userInfos: UserInfoDto[] = await Promise.all(userInfoPromises);

            return {
                users: userInfos
            }
            
        } catch (e) {
            console.error(e);
        }
    }

    async getUserInfo(
        requestUserId: string, 
        targetUserId: string
    ): Promise<UserInfoDto>{
        try {
            const targetUser = await this.UserService.getUserByIdSafe(targetUserId);
            const isFriend = await this.getFriendState(requestUserId, targetUserId);
            const friendCount = await this.FriendService.getFriendCount(targetUserId);
            
            return {
                user: targetUser,
                isFriend,
                friendCount
            }
            
        } catch (err) {
            console.error(err);
        }
    }

    async getFriendState(userId1: string, userId2: string): Promise<FriendState> {
        try {
            const isFriend = await this.FriendService.checkFriend(userId1, userId2);

            if (userId1 === userId2) {
                return FriendState.ME;
            } else {
                if (isFriend) return FriendState.FRIEND;
                else return FriendState.STRANGER;
            }

            return FriendState.STRANGER;

        } catch (e) {
            console.error(e);
        }
    }
}