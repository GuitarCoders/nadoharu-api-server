import { Field, ObjectType } from "@nestjs/graphql";
import { PostDto } from "src/post/dto/post.dto";
import { UserSafeDto } from "src/user/dto/user.dto";

@ObjectType('Nado', {
    description: '나도에 대한 정보를 표현하는 객체입니다.'
})
export class NadoDto {
    @Field(() => String)
    _id: string;

    @Field(() => UserSafeDto)
    nadoer: UserSafeDto;

    @Field(() => String)
    postId: String;

    @Field(() => String)
    createdAt: String;
}