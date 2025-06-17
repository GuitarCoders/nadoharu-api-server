import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { PostDocument } from "src/post/schemas/post.schema";
import { UserDocument } from "src/user/schemas/user.schema";


export type CommentDocument = HydratedDocument<Comment>;

@Schema({
    timestamps: true
})
export class Comment{
    @Prop({
        type: mongoose.Schema.Types.String,
        required: true
    })
    content: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    })
    post: PostDocument;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    })
    commenter: UserDocument;

    @Prop({
        type: mongoose.Schema.Types.Date,
    })
    createdAt: Date;
}

const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.index({ createdAt: 1, _id: 1 });

export { CommentSchema };