import { Injectable, ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common/decorators';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationError } from 'apollo-server-express';
import { Observable } from 'rxjs';
import { LoginRequest } from './models/auth.model';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
    getRequest(context: ExecutionContext){
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }
}

@Injectable()
export class GqlLocalAuthGuard extends AuthGuard('local') {
    getRequest(context: ExecutionContext){
        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext();
        request.body = ctx.getArgs();
        return request;
    }
}

// export const CurrentUser = createParamDecorator(
//     (data: unknown, context: ExecutionContext) => {
//         const ctx = GqlExecutionContext.create(context);
//         return ctx.getContext().req.
//     }
// )