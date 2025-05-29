import { registerEnumType } from "@nestjs/graphql";

export enum PaginationOrder {
    LATEST,
    OLDEST
}

registerEnumType(PaginationOrder, { name: 'PaginationDateType' });