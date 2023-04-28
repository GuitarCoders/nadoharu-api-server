import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { UserSafe } from "src/user/models/user.model";

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

export class UserJwtPayload {
    _id: string;
    account_id: string;
}