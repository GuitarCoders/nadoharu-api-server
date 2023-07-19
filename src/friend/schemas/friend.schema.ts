import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, ObjectId } from "mongoose";
import { UserDocument } from "src/user/schemas/user.schema";


export type FriendDocument = HydratedDocument<Friend>

@Schema({timestamps: true})
export class Friend {
    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    })
    owner: UserDocument;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    })
    friend: UserDocument;

    @Prop({
        type: mongoose.Schema.Types.Date
    })
    createdAt: Date;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);