import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { UserSafeDto } from "src/user/dto/user.dto";

@InputType()
export class LoginRequest{

    @Field(() => String)
    account_id: string;

    @Field(() => String)
    password: string;
}

@ObjectType()
export class LoginResponse extends UserSafeDto{

    @Field(() => String)
    status: string;

    @Field(() => String)
    jwt_token: string;
}

export class UserJwtPayload {
    _id: string;
    account_id: string;
}