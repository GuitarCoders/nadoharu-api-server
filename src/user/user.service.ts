import mongoose, { Model, Document, ObjectId, LeanDocument } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as Bcrypt from 'bcrypt'

import { User, UserDocument, UserSchema } from './schemas/user.schema';
import { UserCreateRequest, UserDeleteRequest, UserDeleteResult, UserSafe, UserUpdateRequest, UserUpdateResult } from './models/user.model';

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
                about_me: result.about_me,
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
            if(!result) throw new Error("null user (temp error)");
            const resultUserSafe = {
                _id: result._id.toString(),
                name: result.name,
                email: result.email,
                account_id: result.account_id,
                about_me: result.about_me,
                friends: result.friends?.map(id => id.toString())
            }
            return resultUserSafe;
        } catch (err) {
            console.error(err);
        }
    }

    async updateUserById(
        jwtOwnerId: string, 
        updateReq: UserUpdateRequest
    ): Promise<UserUpdateResult> {
        try {
            const targetUser = await this.getUserById(jwtOwnerId);
            const pwd_hash = await Bcrypt.hash(updateReq.password, 10);
            const updateResult = await targetUser.updateOne({
                name: updateReq.name,
                pwd_hash: pwd_hash,
                about_me: updateReq.about_me
            })

            console.log(updateResult.modifiedCount);

            const updatedUser: UserUpdateResult = {
                _id: targetUser._id.toString(),
                name: targetUser.name,
                email: targetUser.email,
                account_id: targetUser.account_id,
                about_me: targetUser.about_me,
                friends: targetUser.friends?.map(id => id.toString()),
                status: "success"
            } 
            
            return updatedUser;
        } catch (err) {
            console.error(err)
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
                about_me: " ", //TODO: 빈 문자열도 허용하도록 수정
                friends: []
            });
            await createdUser.save()

            const createdUserSafe: UserSafe = {
                _id : createdUser._id.toString(),
                name : createdUser.name,
                email : createdUser.email,
                account_id : createdUser.account_id,
                about_me: createdUser.about_me,
                friends: createdUser.friends.map(id => id.toString())
            }

            return createdUserSafe;

        } catch (err) {
            console.error(err);
        }
    }

    //jwtOwnerId -> ownerId 이쪽이 좀더 의도에 맞는 듯.
    //함수가 이게 jwt를 타고 오는건지 알 필요가 없다.
    async deleteUser(jwtOwnerId: string, deleteReq: UserDeleteRequest): Promise<UserDeleteResult> {
        const result = new UserDeleteResult;
        try{

            const targetUser = await this.getUserById(jwtOwnerId);
            const deleteResult = await targetUser.deleteOne();

            console.log(deleteResult);

            console.log(this.getUserById(jwtOwnerId));
            result.deleteStatus = true;
            
            return result;
        } catch (err) {
            console.error(err);
            result.deleteStatus = false;
            return result;
        }
    }

    //TODO : Promise type 결정하기
    async addFriend(
        acceptUserId: string, 
        reqUserId: string)
    : Promise<any> {

        try {
            const acceptUser = await this.getUserById(acceptUserId);
            const requestUser = await this.getUserById(reqUserId);

            // acceptUser.friends.push(requestUser._id);
            acceptUser.updateOne({$addToSet: requestUser._id});
            // requestUser.friends.push(acceptUser._id);
            requestUser.updateOne({$addToSet: acceptUser._id});

            // await acceptUser.save();
            // await requestUser.save();
    
            return {success: true};

        } catch {
            return {success: false};
        }


    }
}
