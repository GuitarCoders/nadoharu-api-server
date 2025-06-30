import { Injectable } from "@nestjs/common";
import { Document, Model, Query, SortOrder } from "mongoose";
import { PageInfo, PaginationInput } from "./dto/pagination.dto";
import { PaginationFrom, PaginationSort } from "./enum/pagination.enum";

@Injectable()
export class PaginationService {
    buildPaginationQuery<ResultT, DocT>(
        pagination: PaginationInput, 
        query: Query<ResultT, DocT>,
    ): {paginatedQuery: Query<ResultT, DocT>, noLimitQuery: Query<ResultT, DocT>} {

        const cursor:{time: string, id:string} = pagination.cursor ? JSON.parse(
            Buffer.from(pagination.cursor, 'base64').toString('utf-8')
        ) : null;

        const until:{time: string, id:string} = pagination.until ? JSON.parse(
            Buffer.from(pagination?.until, 'base64').toString('utf-8')
        ) : null;

        const [ltCursor, gtCursor, sort]
            // = pagination.from === PaginationFrom.END
            //     ? [cursor, until, -1 as SortOrder]
            //     : [until, cursor, 1 as SortOrder]
            = pagination.from === PaginationFrom.END
                ? pagination.sort === PaginationSort.DESC
                    ? [cursor, until, -1 as SortOrder]
                    : [until, cursor, 1 as SortOrder]
                : pagination.sort === PaginationSort.ASC
                    ? [until, cursor, 1 as SortOrder]
                    : [cursor, until, -1 as SortOrder]

        query.sort({createdAt: sort, _id: sort});
        if (ltCursor) {
            query.lte('createdAt', ltCursor.time);
            query.lt('_id', ltCursor.id);
        }

        if (gtCursor) {
            query.gte('createdAt', gtCursor.time);
            query.gt('_id', gtCursor.id);
        }

        const noLimitQuery = query.clone();

        query.limit(pagination.limit || 30);

        return {
            paginatedQuery: query, 
            noLimitQuery
        }
    }

    async getPaginatedDocuments<ResultT extends Document[], DocT>(
        pagination: PaginationInput,
        query: Query<ResultT, DocT>
    ): Promise<{paginatedDoc: ResultT, pageInfo: PageInfo}> {
        const beforePaginationQuery = query.clone();

        const {paginatedQuery, noLimitQuery} = this.buildPaginationQuery(pagination, query);
        const paginatedDoc = await paginatedQuery;

        if (pagination.from === PaginationFrom.START) {
            paginatedDoc.reverse();
        }

        return {
            paginatedDoc: paginatedDoc as unknown as ResultT,
            pageInfo: await this.getPageTimeInfo(
                paginatedDoc.at(0),
                paginatedDoc.at(-1),
                beforePaginationQuery,
                noLimitQuery,
                paginatedDoc.length,
                pagination.sort
            )
        };
    }

    async getPageTimeInfo<ResultT, DocT>(
        startDoc: Document,
        endDoc: Document,
        query: Query<ResultT, DocT>,
        noLimitQuery: Query<ResultT, DocT>,
        paginatedDocCount: number,
        sort: PaginationSort
    ): Promise<PageInfo> {

        const startCursorJsonString = startDoc 
            ? 
                JSON.stringify({
                    id: startDoc.get('id'),
                    time: (startDoc.get('createdAt') as Date).toISOString()
                })
            : null;

        const endCursorJsonString = endDoc
            ? 
                JSON.stringify({
                    id: endDoc.get('id'),
                    time: (endDoc.get('createdAt') as Date).toISOString()
                })
            : null;

        const startCursor = startCursorJsonString
            ? Buffer.from(startCursorJsonString, 'utf-8').toString('base64')
            : null;

        const endCursor = endCursorJsonString
            ? Buffer.from(endCursorJsonString, 'utf-8').toString('base64')
            : null;

        const documentModel = query.model;

        const hasOverStart = await documentModel.exists({
            ...query.getFilter(),
            createdAt: 
                sort === PaginationSort.DESC
                    ? {$gt: startDoc?.get('createdAt')}
                    : {$lt: startDoc?.get('createdAt')}
        })

        const hasOverEnd = await documentModel.exists({
            ...query.getFilter(),
            createdAt: 
                sort === PaginationSort.DESC
                    ? {$lt: endDoc?.get('createdAt')}
                    : {$gt: endDoc?.get('createdAt')}
        });
        
        const totalDocCount = await noLimitQuery.count();

        return {
            startCursor,
            endCursor,
            hasOverStart: hasOverStart ? true : false,
            hasOverEnd: hasOverEnd ? true : false,
            hasNext: totalDocCount > paginatedDocCount
        }
    }

}
