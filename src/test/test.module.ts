import { Module } from '@nestjs/common';
import { FriendModule } from 'src/friend/friend.module';
import { UserModule } from 'src/user/user.module';
import { TestResolver } from './test.resolver';

@Module({
  imports: [FriendModule, UserModule],
  providers: [TestResolver]
})
export class TestModule {}
