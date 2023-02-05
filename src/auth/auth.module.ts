import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport/dist';
import { LocalStrategy } from './local.strategy';
import { jwtConstants } from './constants/auth.constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        UserModule, 
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {expiresIn: '10d'}
        })
    ],
    providers: [AuthService, AuthResolver, LocalStrategy, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule {}