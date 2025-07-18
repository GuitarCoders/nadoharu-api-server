import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
    timestamps: true,
})
export class User{
    @Prop({ 
        required: true,
        type: mongoose.Schema.Types.String 
    })
    name: string;

    @Prop({
        required: true,
        unique: true,
        type: mongoose.Schema.Types.String
    })
    account_id: string;

    @Prop({ 
        required: true,
        type: mongoose.Schema.Types.String  
    })
    email: string;

    @Prop({ 
        required: true,
        type: mongoose.Schema.Types.String  
    })
    pwd_hash: string;

    @Prop({
        maxlength: 250,
        type: mongoose.Schema.Types.String,
    })
    about_me: string;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ createdAt: 1, _id: 1 });

export { UserSchema }