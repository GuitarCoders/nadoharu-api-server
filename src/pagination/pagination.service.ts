import { Injectable } from "@nestjs/common";
import { Document, Model, Query } from "mongoose";
import { Cursor, PageInfo, PaginationInput } from "./dto/pagination.dto";

@Injectable()
export class PaginationService {
    buildPaginationQuery<ResultT, DocT>(
        pagination: PaginationInput, 
        query: Query<ResultT, DocT>
    ): {paginatedQuery: Query<ResultT, DocT>, countOnlyQuery: Query<ResultT, DocT>} {

        query.sort({createdAt: -1});
        if (pagination.cursor) {
            query.lte('createdAt', pagination.cursor.time);
            query.lt('_id', pagination.cursor.id);
        }

        if (pagination.until) {
            query.gt('createdAt', pagination.until.time);
            query.gt('_id', pagination.cursor.id);
        }

        const countOnlyQuery = query.clone();

        query.limit(pagination.limit || 30);

        return {
            paginatedQuery: query,
            countOnlyQuery: countOnlyQuery
        }
    }


    getPageTimeInfo(
        lastDoc: Document,
        totalCount: number,
        pageCount: number
    ): PageInfo {
        return {
            cursor: lastDoc ? {
                id: lastDoc.get('id'),
                time: (lastDoc.get('createdAt') as Date).toISOString()
            } : null,
            hasNext: totalCount > pageCount
        }
    }

}
