import { Module } from '@nestjs/common';
import { FriendRequestResolver } from './friendRequest.resolver';
import { FriendRequestService } from './friendRequest.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendRequest, FriendRequestSchema } from './schemas/friendRequest.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{name: FriendRequest.name, schema: FriendRequestSchema}])
  ],
  providers: [FriendRequestResolver, FriendRequestService],
  exports: [FriendRequestService]
})
export class FriendRequestModule {}
