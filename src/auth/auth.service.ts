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
        const isValidPwd = await Bcrypt.compare(reqLogin.password, loginUser.pwd_hash);

        if (loginUser && isValidPwd) {
            const result = {
                _id: loginUser._id.toString(),
                name: loginUser.name,
                email: loginUser.email,
                account_id: loginUser.account_id,
                friends: loginUser.friends?.map(id => id.toString())
            }
            return result
        }

        return null;
    }

    async login(reqLogin: LoginRequest): Promise<LoginResponse> {
        try {
            
            const loginUser = await this.userService.getUserByAccountId(reqLogin.account_id);

            // TODO : loginUser가 값을 받아오지 못할 경우(아이디 없음)에 대한 처리
            if (!loginUser) {
                // TODK : 상세한 에러 전달
                throw new Error("계정 정보가 일치하지 않음");
            }

            if (!(await Bcrypt.compare(reqLogin.password, loginUser.pwd_hash))){
                // TODO : 상세한 에러 전달
                throw new Error("비밀번호 오류"); 
            }

            const jwtPayload = {
                _id: loginUser._id,
                account_id: loginUser.account_id
            }

            const resUser: LoginResponse = {
                _id: loginUser._id.toString(),
                name: loginUser.name,
                email: loginUser.email,
                account_id: loginUser.account_id,
                friends: loginUser.friends.map(id => id.toString()),
                status: "success",
                jwt_token: this.jwtService.sign(jwtPayload)
            }

            return resUser;

        } catch (err) {
            console.error(err);
            const resUser: LoginResponse = {
                _id: "",
                name: "",
                email: "",
                account_id: "",
                friends: [],
                status: "failed",
                jwt_token: ""
            }

            return resUser;
        }
    }

    // async login(user: any) {
    //     const payload = { username: user.username, sub: user.userId};
    //     return {
    //         access_token: this.jwtService.sign(payload)
    //     };
    // }
}
