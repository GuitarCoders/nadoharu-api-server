import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { PostDocument } from "src/post/schemas/post.schema";
import { UserDocument } from "src/user/schemas/user.schema";


export type NadoDocument = HydratedDocument<Nado>;

@Schema({
    timestamps: true
})
export class Nado {
    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    })
    nadoer: UserDocument;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    })
    post: PostDocument;

    @Prop({
        type: mongoose.Schema.Types.Date
    })
    createdAt: Date;
}

const NadoSchema = SchemaFactory.createForClass(Nado);

NadoSchema.index({ createdAt: 1, _id: 1 });

export { NadoSchema };