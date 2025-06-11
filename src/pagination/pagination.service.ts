import { Injectable } from "@nestjs/common";
import { Document, Model, Query } from "mongoose";
import { PageInfo, PaginationInput } from "./dto/pagination.dto";
import { PaginationFrom } from "./enum/pagination.enum";



@Injectable()
export class PaginationService {
    buildPaginationQuery<ResultT, DocT>(
        pagination: PaginationInput, 
        query: Query<ResultT, DocT>,
    ): Query<ResultT, DocT> {

        const cursor:{time: string, id:string} = pagination.cursor ? JSON.parse(
            Buffer.from(pagination.cursor, 'base64').toString('utf-8')
        ) : null;

        const until:{time: string, id:string} = pagination.until ? JSON.parse(
            Buffer.from(pagination?.until, 'base64').toString('utf-8')
        ) : null;

        const [ltCursor, gtCursor]
            = pagination.from === PaginationFrom.END
                ? [cursor, until]
                : [until, cursor]
    

        query.sort({createdAt: -1, _id: -1});
        if (ltCursor) {
            query.lte('createdAt', ltCursor.time);
            query.lt('_id', ltCursor.id);
        }

        if (gtCursor) {
            query.gte('createdAt', gtCursor.time);
            query.gt('_id', gtCursor.id);
        }

        const countOnlyQuery = query.clone();

        query.limit(pagination.limit || 30);

        return query;
    }


    async getPageTimeInfo<ResultT, DocT>(
        startDoc: Document,
        endDoc: Document,
        afterPaginationQuery: Query<ResultT, DocT>
    ): Promise<PageInfo> {

        console.log(startDoc._id);
        console.log(endDoc._id);

        const startCursorJsonString = JSON.stringify(startDoc ? {
            id: startDoc.get('id'),
            time: (startDoc.get('createdAt') as Date).toISOString()
        } : null)

        const endCursorJsonString = JSON.stringify(endDoc ? {
            id: endDoc.get('id'),
            time: (endDoc.get('createdAt') as Date).toISOString()
        } : null)

        const startCursor = Buffer.from(startCursorJsonString, 'utf-8').toString('base64');
        const endCursor = Buffer.from(endCursorJsonString, 'utf-8').toString('base64');

        const documentModel = afterPaginationQuery.model;

        const hasPrevious = await documentModel.exists({
            ...afterPaginationQuery.getFilter(),
            createdAt: {
                $gt: startDoc?.get('createdAt')
            }
        })

        const hasNext = await documentModel.exists({
            ...afterPaginationQuery.getFilter(),
            createdAt: {
                $lt: endDoc?.get('createdAt')
            }
        });

        return {
            startCursor,
            endCursor,
            hasPrevious: hasPrevious ? true : false,
            hasNext: hasNext ? true : false
        }
    }

}
