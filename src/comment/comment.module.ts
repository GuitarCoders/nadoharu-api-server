import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { PostModule } from 'src/post/post.module';
import { UserModule } from 'src/user/user.module';
import { PaginationModule } from 'src/pagination/pagination.module';

@Module({
  imports:[
    UserModule,
    PostModule,
    PaginationModule,
    MongooseModule.forFeature([{name: Comment.name, schema: CommentSchema}])
  ],
  providers: [CommentService, CommentResolver],
  exports: [CommentService]
})
export class CommentModule {}
