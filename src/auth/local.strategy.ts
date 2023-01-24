import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest } from './models/auth.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(reqLogin: LoginRequest): Promise<any> {
        const loginUser = await this.authService.validateUser(reqLogin);
        if(!loginUser) {
            throw new UnauthorizedException();
        }

        return loginUser;
    }
}


// import { Strategy } from 'passport-local';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { AuthService } from './auth.service';

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private authService: AuthService) {
//     super();
//   }

//   async validate(username: string, password: string): Promise<any> {
//     const user = await this.authService.validateUser(username, password);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }
// }
