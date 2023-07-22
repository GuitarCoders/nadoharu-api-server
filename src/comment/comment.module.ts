import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comment.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name: Comment.name, schema: CommentSchema}])
  ],
  providers: [CommentService, CommentResolver],
  exports: [CommentService]
})
export class CommentModule {}
