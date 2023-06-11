import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

import { User, UserDocument } from "src/user/schemas/user.schema";

export type FriendRequestDocument = HydratedDocument<FriendRequest>;

@Schema({timestamps: true})
export class FriendRequest{
    
    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    })
    requestUser: UserDocument;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    })
    receiveUser: UserDocument;

    @Prop({
        type: mongoose.Schema.Types.String
    })
    requestMessage: string;

    @Prop({
        type: mongoose.Schema.Types.Date
    })
    createdAt: Date;

}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);