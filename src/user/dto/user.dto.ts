// TODO : DTO라고 부르는 구조와 이것이 뭐가 다른지 알아봐야 할 필요가 있음

import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { isNullableType } from "graphql";
import { ObjectId } from "mongoose";
import { Int } from "type-graphql";
import { UserDocument } from "../schemas/user.schema";

@ObjectType('User',
    {description: "유저의 기초적인 정보를 표현하는 객체입니다."}
)
export class UserSafeDto{
    
    @Field(() => String, {description: "유저의 고유 id입니다."})
    _id: string;
    
    @Field(() => String, {description: "유저의 표시용 이름입니다."})
    name: string;
    
    @Field(() => String, {description: "유저의 가입시 사용한 이메일입니다."})
    email: string;
    
    @Field(() => String, {description: "유저의 로그인 전용 계정이름입니다."})
    account_id: string;
    
    @Field(() => String, {description: "유저의 자기소개 내용입니다."})
    about_me: string;
}

@ObjectType('Users',
    {description: "유저의 목록을 User객체의 배열로 가지고있는 객체입니다."}
)
export class UsersSafeDto{
    @Field(() => [UserSafeDto])
    Users: UserSafeDto[];
}

@InputType('UserCreate',
    {description: "유저를 생성할때 필요한 정보를 담는 Input객체입니다."}
)
export class UserCreateRequestDto{

    @Field(() => String, {
        description: "유저의 표시용 이름입니다. 해당 정보는 로그인할때 사용되지 않습니다. 또한 중복을 허용합니다."
    })
    name: string;

    @Field(() => String, {
        description: "유저의 로그인용 이름입니다. 중복을 허용하지 않습니다."
    })
    account_id: string;

    @Field(() => String, {
        description: "유저의 식별용 이메일입니다. 해당 정보는 로그인할때 사용되지 않습니다. 중복을 허용하지만, 같은 이메일을 가진 유저는 서비스 내에서 같은 사람이 여러개의 계정을 가진 것으로 취급합니다."
    })
    email: string;

    @Field(() => String, {
        description: "유저의 로그인용 비밀번호입니다. 해당 정보는 암호화되어 서버에 저장됩니다. 저장된 암호는 다시 복호화할 수 없습니다."
    })
    password: string;
}

@InputType('UserUpdate', {
    description: "유저의 정보를 수정/갱신하기 위한 정보를 담는 Input객체입니다."
})
export class UserUpdateRequestDto{
    
    @Field(() => String, {
        description: "유저의 표시용 이름입니다. 해당 정보는 로그인할때 사용되지 않습니다. 또한 중복을 허용합니다. 해당 항목은 생략할 수 있으며, 생략할 경우 기존의 값을 유지합니다.",
        nullable: true
    })
    name?: string;

    @Field(() => String, {
        description: "유저의 자기소개 내용입니다. 해당 항목은 생략할 수 있으며, 생략할 경우 기존의 값을 유지합니다.",
        nullable: true
    })
    about_me?: string;
}

@InputType('UserUpdatePasswordInput', {
    description: "유저의 비밀번호를 변경하기 위한 정보를 담는 Input 객체입니다."
})
export class UserUpdatePasswordRequestDto {
    
    @Field(() => String, {
        description: "로그인한 유저의 기존 비밀번호입니다. 비밀번호를 변경하기 위해 기존 비밀번호가 필요합니다."
    })
    oldPassword: string;

    @Field(() => String, {
        description: "로그인한 유저가 변경할 비밀번호입니다."
    })
    newPassword: string;
}

@ObjectType('UserUpdateResult')
export class UserUpdateResultDto extends UserSafeDto{

    @Field(() => String)
    status: string;

}

@InputType('UserDeleteRequest')
export class UserDeleteRequestDto{
    
    @Field(() => Boolean)
    deleteConfirm: boolean;

}

/** 유저 삭제 결과 모델 */
@ObjectType('UserDeleteResult')
export class UserDeleteResultDto{
    @Field(() => Boolean)
    deleteStatus: boolean;
}
