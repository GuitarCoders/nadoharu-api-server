import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport/dist';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        UserModule, 
        PassportModule,
        ConfigModule.forRoot({
            envFilePath: ['.env.', process.env.NODE_ENV].join(""),
            isGlobal: true
        }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {expiresIn: '100d'}
        })
    ],
    providers: [AuthService, AuthResolver, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}


