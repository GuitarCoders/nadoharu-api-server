import { Model, Document, ObjectId, LeanDocument } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as Bcrypt from 'bcrypt'

import { User, UserDocument, UserSchema } from './schemas/user.schema';
import { UserCreateRequest, UserSafe } from './types/user.types';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async getUserByAccountId(account_id: string): Promise<LeanDocument<UserDocument>> {
        try {
            const result = await this.userModel.findOne({account_id});
            return result;
        } catch (err) {
            console.error(err);
        }
    }

    async createUser(reqUser: UserCreateRequest): Promise<UserSafe> {
        try {

            const pwd_hash = await Bcrypt.hash(reqUser.password, 10);

            const createdUser = await this.userModel.create({
                name: reqUser.name,
                account_id: reqUser.account_id,
                email: reqUser.email,
                pwd_hash: pwd_hash,
                friends: []
            });
            await createdUser.save()

            const createdUserSafe: UserSafe = {
                _id : createdUser._id,
                name : createdUser.name,
                email : createdUser.email,
                account_id : createdUser.account_id,
                friends: createdUser.friends.map(id => id.toString())
            }

            return createdUserSafe;

        } catch (err) {
            console.error(err);
        }
    }
}
