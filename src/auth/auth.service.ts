import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as Bcrypt from 'bcrypt';
import { User, UserDocument } from 'src/user/schemas/user.schema';

import { LoginRequest, LoginResponse } from './types/auth.types';


@Injectable()
export class AuthService {
    //인증 관련 Object, Model 구성정보 만들기 (constructor)
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async login(reqLogin: LoginRequest): Promise<LoginResponse> {
        try {

            

            return
        } catch (err) {
            console.error(err);
        }
    }
}
