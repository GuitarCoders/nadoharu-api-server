import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './models/auth.model';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Query(() => LoginResponse, { name: 'login'})
    async getUserWithJwtToken(
        @Args('account_id') id: string, 
        @Args('password') pwd: string
    ): Promise<LoginResponse> {
        return await this.authService.login({account_id: id, password: pwd});
    }
}
