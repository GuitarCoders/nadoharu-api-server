import { Module } from '@nestjs/common';
import { NadoResolver } from './nado.resolver';
import { NadoService } from './nado.service';
import { UserModule } from 'src/user/user.module';
import { PostModule } from 'src/post/post.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Nado, NadoSchema } from './schemas/nado.schema';
import { PaginationModule } from 'src/pagination/pagination.module';
import { NadoMapper } from './mapper/nado.mapper';

@Module({
  imports: [
    UserModule,
    PostModule,
    PaginationModule,
    MongooseModule.forFeature([{name: Nado.name, schema: NadoSchema}]),
  ],
  providers: [NadoResolver, NadoService, NadoMapper],
  exports: [NadoService]
})
export class NadoModule {}
