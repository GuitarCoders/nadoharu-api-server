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
    requester: UserDocument;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    })
    receiver: UserDocument;

    @Prop({
        type: mongoose.Schema.Types.String
    })
    requestMessage: string;

    @Prop({
        type: mongoose.Schema.Types.Date
    })
    createdAt: Date;

}

const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);

FriendRequestSchema.index({ createdAt: 1, _id: 1 });

export { FriendRequestSchema };