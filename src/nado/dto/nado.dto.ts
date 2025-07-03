import { Field, ObjectType } from "@nestjs/graphql";
import { PostDto } from "src/post/dto/post.dto";
import { UserSafeDto } from "src/user/dto/user.dto";

@ObjectType('Nado', {
    description: '나도에 대한 정보를 표현하는 객체입니다.'
})
export class NadoDto {
    @Field(() => String, {
        description: '나도를 누른 원본 글의 id입니다.'
    })
    originPostId: String;
}

@ObjectType('NadoCancelResult', {
    description: '나도를 취소했을 때 성공 여부를 표현하는 객체입니다.'
})
export class NadoCancelResultDto {
    @Field(() => Boolean)
    success: boolean;
}