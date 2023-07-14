import { Module } from '@nestjs/common';
import { FriendRequestResolver } from './friendRequest.resolver';
import { FriendRequestService } from './friendRequest.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendRequest, FriendRequestSchema } from './schemas/friendRequest.schema';
import { UserModule } from 'src/user/user.module';
import { FriendModule } from 'src/friend/friend.module';

@Module({
  imports: [
    UserModule,
    FriendModule,
    MongooseModule.forFeature([{name: FriendRequest.name, schema: FriendRequestSchema}])
  ],
  providers: [FriendRequestResolver, FriendRequestService],
  exports: [FriendRequestService]
})
export class FriendRequestModule {}
