import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { NadoService } from './nado.service';
import { NadoDto } from './dto/nado.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { UserJwtPayload } from 'src/auth/models/auth.model';

@Resolver()
export class NadoResolver {
    constructor (
        private readonly NadoService: NadoService
    ) {}

    @Mutation(() => NadoDto, {
        name: 'addNado'
    })
    @UseGuards(GqlAuthGuard)
    async AddNado(
        @CurrentUser() user: UserJwtPayload,
        @Args('targetPostId') targetPostId: string
    ): Promise<NadoDto> {
        return await this.NadoService.addNado(user._id, targetPostId);
    }
}
