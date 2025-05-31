import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

@InputType()
export class CursorInput {
    @Field(() => String)
    time: string;

    @Field(() => String)
    id: string;
}

@ObjectType()
export class Cursor {
    @Field(() => String)
    time: string;

    @Field(() => String)
    id: string;
}

@InputType()
export class PaginationInput {
    @Field(() => CursorInput, {nullable: true})
    cursor?: CursorInput;

    @Field(() => CursorInput, {nullable: true})
    until?: CursorInput;

    @Field(() => Int, {nullable: true})
    limit?: number;
}

@ObjectType()
export class PageInfo {
    @Field(() => Boolean)
    hasNext: boolean

    @Field(() => Cursor, {nullable: true})
    cursor?: Cursor
}