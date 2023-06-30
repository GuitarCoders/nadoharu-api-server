// TODO : DTO라고 부르는 구조와 이것이 뭐가 다른지 알아봐야 할 필요가 있음

import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { isNullableType } from "graphql";
import { ObjectId } from "mongoose";

@ObjectType('User')
export class UserSafeDto{
    
    @Field(() => String)
    _id: string;
    
    @Field(() => String)
    name: string;
    
    @Field(() => String)
    email: string;
    
    @Field(() => String)
    account_id: string;
    
    @Field(() => String)
    about_me: string;
    
    @Field(() => [String])
    friends: string[];
}

@InputType('UserCreate')
export class UserCreateRequestDto{

    @Field(() => String)
    name: string;

    @Field(() => String)
    account_id: string;

    @Field(() => String)
    email: string;

    @Field(() => String)
    password: string;
}

@InputType('UserUpdate')
export class UserUpdateRequestDto{
    
    @Field(() => String)
    name: string;

    @Field(() => String)
    about_me: string;

    @Field(() => String)
    password: string;
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