import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, mongo } from "mongoose";
import { UserDocument } from "src/user/schemas/user.schema";


export type PostDocument = HydratedDocument<Post>;

@Schema({
    timestamps: true
})
export class Post {
    @Prop({
        required: true,
        type: mongoose.Schema.Types.String
    })
    content: string;

    @Prop({
        required: false,
        type: mongoose.Schema.Types.String
    })
    tags: string;

    //TODO : category db를 따로 만들것인가.. 혹은 user에 넣을 것인가.
    //mongoose가 유연해도 얼마나 유연해도 되는지 고민할 필요가 있다.
    @Prop({
        required: true,
        type: mongoose.Schema.Types.String
    })
    category: string;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    })
    author: UserDocument;
    
    @Prop({
        type: mongoose.Schema.Types.Date
    })
    createdAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);