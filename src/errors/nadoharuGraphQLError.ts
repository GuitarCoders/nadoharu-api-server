import { GraphQLError } from "graphql";
import { NadoharuErrorCatalog, NadoharuErrorType } from "./nadoharuErrorCatalog";

export class NadoharuGraphQLError extends GraphQLError {
    constructor(
        type: NadoharuErrorType,
        message?: string,
        extra?: any
    ) {
        const errorEntry = NadoharuErrorCatalog[type]

        super(message ?? errorEntry.defaultMessage,
            undefined, undefined, undefined, undefined, undefined,
            {
                code: errorEntry.code,
                type,
                ...extra
            }
        );
    }
}