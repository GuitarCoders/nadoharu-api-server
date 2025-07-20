import { Field, InputType, ObjectType } from "@nestjs/graphql";

@ObjectType('imageUploadInfo')
export class ImageUploadInfo {
    @Field(() => String)
    uploadUrl: string;

    @Field(() => String)
    publicUrl: string;
}