import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { UserSafe } from "src/user/types/user.types";

@InputType()
export class LoginRequest{

    @Field(() => String)
    account_id: string;

    @Field(() => String)
    password: string;
}

@ObjectType()
export class LoginResponse extends UserSafe{

    @Field(() => String)
    status: string;

    @Field(() => String)
    jwt_token: string;

}