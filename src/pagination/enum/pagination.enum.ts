import { registerEnumType } from "@nestjs/graphql";

export enum PaginationFrom {
    START,
    END
}

registerEnumType(PaginationFrom, { name: 'PaginationFrom' });