import { registerEnumType } from "@nestjs/graphql";

export enum PageBoundaryType {
    LATEST,
    OLDEST
}

export enum PaginationDirection {
    BEFORE,
    AFTER
}

registerEnumType(PageBoundaryType, {name: 'PageBoundaryType'});
registerEnumType(PaginationDirection, {name: 'PaginationDirection'});