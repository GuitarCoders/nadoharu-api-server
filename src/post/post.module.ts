import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentModule } from 'src/comment/comment.module';
import { FriendModule } from 'src/friend/friend.module';
import { UserModule } from 'src/user/user.module';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { Post, PostSchema } from './schemas/post.schema';
import { PaginationModule } from 'src/pagination/pagination.module';
import { PostMapper } from './mapper/post.mapper';

@Module({
  imports: [
    UserModule,
    FriendModule,
    PaginationModule,
    MongooseModule.forFeature([{name: Post.name, schema: PostSchema}]),
  ],
  providers: [PostResolver, PostService, PostMapper],
  exports: [PostService, PostMapper]
})
export class PostModule {}
