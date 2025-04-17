import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as Bcrypt from 'bcrypt';
import { User, UserDocument } from 'src/user/schemas/user.schema';

import { LoginRequest, LoginResponse } from './models/auth.model';
import { createSecureServer } from 'http2';
import { UserService } from 'src/user/user.service';
import { UserSafeDto } from 'src/user/dto/user.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async validateUser(reqLogin: LoginRequest): Promise<UserSafeDto> {
        try {
            const loginUser = await this.userService.getUserByAccountId(reqLogin.account_id);
            // TODO : loginUser가 값을 받아오지 못할 경우(아이디 없음)에 대한 처리
            if (!loginUser) {
                // TODO : 상세한 에러 전달
                throw new Error("계정 정보가 일치하지 않음");
            }

            if (!(await Bcrypt.compare(reqLogin.password, loginUser.pwd_hash))){
                // TODO : 상세한 에러 전달
                throw new Error("비밀번호 오류"); 
            }
            //TODO : 아래 내용은 적절히 지우자
            const isValidPwd = await Bcrypt.compare(reqLogin.password, loginUser.pwd_hash);

            if (loginUser && isValidPwd) {
                const result = {
                    _id: loginUser._id.toString(),
                    name: loginUser.name,
                    email: loginUser.email,
                    account_id: loginUser.account_id,
                    about_me: loginUser.about_me,
                }
                return result
            }
        } catch (e) {
            console.error(e);
            return null;
        }
        
    }

    async login(reqLogin: LoginRequest): Promise<LoginResponse> {
        try {
            
            const loginUser = await this.validateUser(reqLogin);

            const jwtPayload = {
                _id: loginUser._id,
                account_id: loginUser.account_id
            }

            const resUser: LoginResponse = {
                ... loginUser, 
                status: "success",
                jwt_token: this.jwtService.sign(jwtPayload)
            }

            return resUser;

        } catch (err) {
            console.error(err);
        }
    }

}
