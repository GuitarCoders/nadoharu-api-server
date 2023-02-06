import { Model, Document, ObjectId, LeanDocument } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as Bcrypt from 'bcrypt'

import { User, UserDocument, UserSchema } from './schemas/user.schema';
import { UserCreateRequest, UserSafe } from './models/user.model';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async getUserByAccountId(account_id: string): Promise<UserDocument> {
        try {
            const result = await this.userModel.findOne({account_id : account_id});
            return result;
        } catch (err) {
            console.error(err);
        }
    }

    async getUserByAccountIdSafe(account_id: string): Promise<UserSafe> {
        try {
            const result = await this.getUserByAccountId(account_id);
            if(!result) throw new Error("Account_id 없음");
            const resultUserSafe = {
                _id: result._id.toString(),
                name: result.name,
                email: result.email,
                account_id: result.account_id,
                friends: result.friends?.map(id => id.toString())
            }
            return resultUserSafe;
        } catch (err) {
            console.error(err);
        }
    }

    async getUserById(id: string): Promise<UserDocument> {
        try {
            const result = await this.userModel.findOne({_id : id});
            return result;
        } catch (err) {
            console.error(err);
        }
    }

    async getUserByIdSafe(id: string): Promise<UserSafe> {
        try {
            const result = await this.getUserById(id);
            const resultUserSafe = {
                _id: result._id.toString(),
                name: result.name,
                email: result.email,
                account_id: result.account_id,
                friends: result.friends?.map(id => id.toString())
            }
            return resultUserSafe;
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
                _id : createdUser._id.toString(),
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
