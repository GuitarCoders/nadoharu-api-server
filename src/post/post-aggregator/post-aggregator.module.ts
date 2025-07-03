import { Module } from '@nestjs/common';
import { PostAggregatorService } from './post-aggregator.service';
import { PostAggregatorResolver } from './post-aggregator.resolver';
import { NadoModule } from 'src/nado/nado.module';
import { PostModule } from '../post.module';
import { CommentModule } from 'src/comment/comment.module';
import { UserInfoModule } from 'src/userInfo/userInfo.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    NadoModule, 
    PostModule, 
    CommentModule, 
    UserModule,
  ],
  providers: [
    PostAggregatorService,
    PostAggregatorResolver
  ],
  exports: [PostAggregatorService]
})
export class PostAggregatorModule {}
