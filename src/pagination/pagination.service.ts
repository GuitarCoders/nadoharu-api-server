import { Injectable } from "@nestjs/common";
import { Query } from "mongoose";
import { PageTimeInfo, PaginationTimeInput } from "./dto/pagination.dto";
import { PageBoundaryType } from "./enum/pagination.enum";

@Injectable()
export class PaginationService {
    buildPaginationQuery<ResultT, DocT>(
        pagination: PaginationTimeInput, 
        query: Query<ResultT, DocT>
    ): {paginatedQuery: Query<ResultT, DocT>, countOnlyQuery: Query<ResultT, DocT>} {
        
        query.sort({createdAt: -1});
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

    getPageTimeInfo(
        timeCursor: string,
        totalCount: number,
        pageCount: number
    ): PageTimeInfo {
        return {
            timeCursor,
            hasNext: totalCount > pageCount,
            boundaryType: PageBoundaryType.OLDEST
        }
    }
}
