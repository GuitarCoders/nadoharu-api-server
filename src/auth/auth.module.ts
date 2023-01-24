import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [AuthService, AuthResolver]
})
export class AuthModule {}

