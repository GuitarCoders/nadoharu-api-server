import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as Bcrypt from 'bcrypt';
import { User, UserDocument } from 'src/user/schemas/user.schema';

import { LoginRequest, LoginResponse } from './types/auth.types';
import { createSecureServer } from 'http2';


@Injectable()
export class AuthService {
    //인증 관련 Object, Model 구성정보 만들기 (constructor)
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async login(reqLogin: LoginRequest): Promise<LoginResponse> {
        try {
            
            const loginUser = await this.userModel.findOne({
                account_id: reqLogin.account_id
            }).lean();

            // TODO : loginUser가 값을 받아오지 못할 경우(아이디 없음)에 대한 처리
            if (!(await Bcrypt.compare(reqLogin.password, loginUser.pwd_hash))){
                throw new Error("비밀번호 오류") // TODO : 상세한 에러 전달
            }

            

            const resUser: LoginResponse = {
                _id: loginUser._id,
                name: loginUser.name,
                email: loginUser.email,
                account_id: loginUser.account_id,
                friends: loginUser.friends.map(id => id.toString()),
                status: "ok",
                jwt_token: "good"
            }

            return resUser;
        } catch (err) {
            console.error(err);
        }
    }
}
