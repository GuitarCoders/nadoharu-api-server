import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'


import { AuthService } from './auth.service';
import { LoginResponse } from './models/auth.model';
// import { LocalAuthGuard } from './local-auth.guard';
import { GqlAuthGuard, GqlLocalAuthGuard } from './gql-auth.guard';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Query(() => LoginResponse, { name: 'login'})
    @UseGuards(GqlLocalAuthGuard)
    async getUserWithJwtToken(
        @Args('username') id: string, 
        @Args('password') pwd: string,
    ): Promise<LoginResponse> {
        console.log("auth resolver");
        return await this.authService.login({account_id: id, password: pwd});
    }
    
    @Query(() => LoginResponse,{ name: 'jwtTest'})
    @UseGuards(GqlAuthGuard)
    async jwtGuardTest(
        @Args('test_arg') arg: string
    ): Promise<LoginResponse> {
        return {
            _id: "a",
            name: "test",
            account_id: "test",
            email: "test@test.com",
            about_me: "hihi",
            friends: [],
            status: "test",
            jwt_token: "testToken"
        }
    }
}
