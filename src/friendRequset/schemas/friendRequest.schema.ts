import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

import { User } from "src/user/schemas/user.schema";

export type FriendRequestDocument = HydratedDocument<FriendRequest>;

@Schema({timestamps: true})
export class FriendRequest{
    
    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    })
    requestUserId: User;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    })
    receiveUserId: User;

    @Prop({
        type: mongoose.Schema.Types.String
    })
    requestMessage: string;

}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);