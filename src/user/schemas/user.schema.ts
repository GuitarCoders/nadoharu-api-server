import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Mongoose, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema({timestamps: true})
@ObjectType()
export class User{

    @Field(() => String)
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({ 
        required: true,
        type: mongoose.Schema.Types.String 
    })
    @Field(() => String)
    name: string;

    @Prop({
        required: true,
        unique: true,
        type: mongoose.Schema.Types.String
    })
    @Field(() => String)
    account_id: string;

    @Prop({ 
        required: true,
        type: mongoose.Schema.Types.String  
    })
    @Field(() => String)
    email: string;

    @Prop({ 
        required: true,
        type: mongoose.Schema.Types.String  
    })
    @Field(() => String)
    pwd_salt: string;

    @Prop({ 
        required: true,
        type: mongoose.Schema.Types.String  
    })
    @Field(() => String)
    pwd_hash: string;

    @Prop({ 
        type: [mongoose.Schema.Types.ObjectId], ref: 'User' 
    })
    @Field(() => [String])
    friends: ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);