import { Injectable } from "@nestjs/common";

@Injectable()
export class PaginationService {
    getPagination(page: number = 1, limit: number = 10) {
        const take = limit;
        const skip = (page - 1) * limit;
        return { take, skip };
    }
}
