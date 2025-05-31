import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { PageBoundaryType, PaginationDirection } from "../enum/pagination.enum";

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
    timeCursor?: string;

    @Field(() => String, {nullable: true})
    timeUntil?: string;

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
    @Field(() => String, {nullable: true})
    timeCursor?: string

    @Field(() => PageBoundaryType)
    boundaryType: PageBoundaryType
}