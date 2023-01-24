// TODO : DTO라고 부르는 구조와 이것이 뭐가 다른지 알아봐야 할 필요가 있음

import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { isNullableType } from "graphql";
import { ObjectId } from "mongoose";

@InputType()
export class UserCreateRequest{

    @Field(() => String)
    name: string;

    @Field(() => String)
    account_id: string;

    @Field(() => String)
    email: string;

    @Field(() => String)
    password: string;
}

@ObjectType()
export class UserSafe{

    @Field(() => String)
    _id: string;

    @Field(() => String)
    name: string;

    @Field(() => String)
    email: string;

    @Field(() => String)
    account_id: string;

    @Field(() => [String])
    friends: string[];
}