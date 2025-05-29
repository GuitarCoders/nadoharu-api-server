import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { PaginationOrder } from "../enum/pagination.enum";

@InputType()
export class PaginationOffsetInput {
    @Field(() => Int, {nullable: true})
    skip?: number;

    @Field(() => Int, {nullable: true})
    limit?: number;
}

@InputType()
export class PaginationTimeInput {
    @Field(() => String, {nullable: true})
    before?: string;

    @Field(() => Int, {nullable: true})
    limit?: number;
}

@ObjectType()
export class PageInfo {
    @Field(() => Boolean)
    hasNext: boolean
}

@ObjectType()
export class PageTimeInfo extends PageInfo {
    @Field(() => String)
    timeCursor: string

    @Field(() => PaginationOrder)
    paginationOrder: PaginationOrder
}