import { Module } from "@nestjs/common";
import { FriendModule } from "src/friend/friend.module";
import { UserModule } from "src/user/user.module";
import { UserInfoResolver } from "./userInfo.resolver";
import { UserInfoService } from "./userInfo.service";
import { FriendRequestModule } from "src/friendRequset/friendRequest.module";

@Module({
    imports: [
        UserModule,
        FriendModule,
        FriendRequestModule
    ],
    providers: [UserInfoResolver, UserInfoService],
    exports: []
})
export class UserInfoModule {};