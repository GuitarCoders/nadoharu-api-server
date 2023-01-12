import { Args, Query, Resolver } from '@nestjs/graphql';
import mongoose, { LeanDocument } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
    constructor(
        private readonly UserService: UserService
    ) {}

    @Query(() => User, { name: 'userById'})
    async getUserOne(@Args('id') id: string): Promise<LeanDocument<User>> {
        return await this.UserService.getUserByAccountId(id);
    }
}
