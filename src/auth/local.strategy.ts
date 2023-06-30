import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest } from './models/auth.model';
import { UserSafeDto } from 'src/user/dto/user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(username: string, password: string): Promise<UserSafeDto> {
        const loginUser = await this.authService.validateUser({
            account_id: username,
            password: password
        });
        if(!loginUser) {
            // throw new UnauthorizedException();
        }
        return loginUser;
    }
}