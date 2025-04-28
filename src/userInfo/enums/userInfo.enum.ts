import { registerEnumType } from "@nestjs/graphql";

export enum FriendState {
    FRIEND,
    ME,
    STRANGER
}

registerEnumType(FriendState, { name: 'FriendState' });