import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendModule } from 'src/friend/friend.module';
import { UserModule } from 'src/user/user.module';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { Post, PostSchema } from './schemas/post.schema';

@Module({
  imports: [
    UserModule,
    FriendModule,
    MongooseModule.forFeature([{name: Post.name, schema: PostSchema}])
  ],
  providers: [PostResolver, PostService],
  exports: [PostService]
})
export class PostModule {}
