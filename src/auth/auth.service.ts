import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as Bcrypt from 'bcrypt';
import { User, UserDocument } from 'src/user/schemas/user.schema';

import { LoginRequest, LoginResponse } from './models/auth.model';
import { createSecureServer } from 'http2';
import { UserService } from 'src/user/user.service';
import { UserSafe } from 'src/user/models/user.model';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    //인증 관련 Object, Model 구성정보 만들기 (constructor)
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async validateUser(reqLogin: LoginRequest): Promise<UserSafe> {
        const loginUser = await this.userService.getUserByAccountId(reqLogin.account_id);
        const isValidPwd = await Bcrypt.compare(reqLogin.account_id, loginUser.pwd_hash);

        if (loginUser && isValidPwd) {
            const { pwd_hash, ...result } = {
                ...loginUser,
                friends: loginUser.friends.map(friend => friend.toString())
            }

            return result
        }

        return null;
    }

    // async login(reqLogin: LoginRequest): Promise<LoginResponse> {
    //     try {
            
    //         const loginUser = await this.userService.getUserByAccountId(reqLogin.account_id);

    //         // TODO : loginUser가 값을 받아오지 못할 경우(아이디 없음)에 대한 처리
    //         if (!(await Bcrypt.compare(reqLogin.password, loginUser.pwd_hash))){
    //             throw new Error("비밀번호 오류") // TODO : 상세한 에러 전달
    //         }

    //         const resUser: LoginResponse = {
    //             _id: loginUser._id,
    //             name: loginUser.name,
    //             email: loginUser.email,
    //             account_id: loginUser.account_id,
    //             friends: loginUser.friends.map(id => id.toString()),
    //             status: "ok", //TODO : 이거 어캐할건지?
    //             jwt_token: "good"  //TODO : jwt Token 발급하기
    //         }

    //         return resUser;
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId};
        return {
            access_token: this.jwtService.sign(payload)
        };
    }
}
