import { Module } from "@nestjs/common";
import { FriendModule } from "src/friend/friend.module";
import { UserModule } from "src/user/user.module";
import { UserResolver } from "src/user/user.resolver";
import { UserInfoResolver } from "./userInfo.resolver";
import { UserInfoService } from "./userInfo.service";

@Module({
    imports: [
        UserModule,
        FriendModule
    ],
    providers: [UserInfoResolver, UserInfoService],
    exports: []
})
export class UserInfoModule {};