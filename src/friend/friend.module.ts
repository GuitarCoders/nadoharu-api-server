import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendResolver } from './friend.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Friend, FriendSchema } from './schemas/friend.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Friend.name, schema: FriendSchema}]),
    UserModule
  ],
  providers: [
    FriendService, 
    FriendResolver
  ],
  exports: [
    FriendService
  ]
})
export class FriendModule {}
