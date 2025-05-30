import { Injectable } from "@nestjs/common";
import { Query } from "mongoose";
import { PaginationTimeInput } from "./dto/pagination.dto";

@Injectable()
export class PaginationService {
    buildPaginationQuery<ResultT, DocT>(
        pagination: PaginationTimeInput, 
        query: Query<ResultT, DocT>
    ): {paginatedQuery: Query<ResultT, DocT>, countOnlyQuery: Query<ResultT, DocT>} {
        if (pagination.timeCursor) {
            query.lt('createdAt', pagination.timeCursor);
        }
        if (pagination.timeUntil) {
            query.gt('createdAt', pagination.timeUntil);
        }

        const countOnlyQuery = query.clone();

        query.limit(pagination.limit || 10);

        return {
            paginatedQuery: query,
            countOnlyQuery: countOnlyQuery
        }
    }
}
