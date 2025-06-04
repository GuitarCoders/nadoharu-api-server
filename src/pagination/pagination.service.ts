import { Injectable } from "@nestjs/common";
import { Document, Model, Query } from "mongoose";
import { PageInfo, PaginationInput } from "./dto/pagination.dto";

@Injectable()
export class PaginationService {
    buildPaginationQuery<ResultT, DocT>(
        pagination: PaginationInput, 
        query: Query<ResultT, DocT>
    ): {paginatedQuery: Query<ResultT, DocT>, countOnlyQuery: Query<ResultT, DocT>} {

        const cursor:{time: string, id:string} = pagination.cursor ? JSON.parse(
            Buffer.from(pagination.cursor, 'base64').toString('utf-8')
        ) : null;

        const until:{time: string, id:string} = pagination.until ? JSON.parse(
            Buffer.from(pagination?.until, 'base64').toString('utf-8')
        ) : null;

        query.sort({createdAt: -1});
        if (pagination.cursor) {
            query.lte('createdAt', cursor.time);
            query.lt('_id', cursor.id);
        }

        if (pagination.until) {
            query.gt('createdAt', until.time);
            query.gt('_id', cursor.id);
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

        const cursorJsonString = JSON.stringify(lastDoc ? {
            id: lastDoc.get('id'),
            time: (lastDoc.get('createdAt') as Date).toISOString()
        } : null)

        const cursor = Buffer.from(cursorJsonString, 'utf-8').toString('base64');

        return {
            cursor,
            hasNext: totalCount > pageCount
        }
    }

}
