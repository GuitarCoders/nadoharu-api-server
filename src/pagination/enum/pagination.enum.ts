import { registerEnumType } from "@nestjs/graphql";

export enum PaginationFrom {
    START,
    END
}

export enum PaginationSort {
    ASC,
    DESC
}

registerEnumType(PaginationFrom, { name: 'PaginationFrom' });
registerEnumType(PaginationSort, { name: 'PaginationSort' });