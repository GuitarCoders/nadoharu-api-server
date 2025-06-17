import mongoose, { Model, Document, ObjectId, LeanDocument, UpdateWriteOpResult } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as Bcrypt from 'bcrypt'

import { User, UserDocument, UserSchema } from './schemas/user.schema';
import { UserCreateRequestDto, UserDeleteRequestDto, UserDeleteResultDto, UserSafeDto, UsersSafeDto, UserUpdatePasswordRequestDto, UserUpdateRequestDto, UserUpdateResultDto } from './dto/user.dto';
import { error } from 'console';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    userDocumentToUserSafe(doc: UserDocument): UserSafeDto{
        return {
            _id: doc._id.toString(),
            name: doc.name,
            email: doc.email,
            account_id: doc.account_id,
            about_me: doc.about_me,
        }
    }

    async getUsers(search?: string): Promise<UserDocument[]> {
        try {
            const result = await this.userModel.find();
            return result;
        } catch (err) {
            console.error(err);
        }
    }

    async findUsers(search: string): Promise<UsersSafeDto> {
        try {
            const findRegExp = new RegExp(`${search}`, 'i');
            const result = await this.userModel.find({ $or: [
                {name: { $regex: findRegExp }},
                {account_id: { $regex: findRegExp} }
            ]});
            
            
            return {Users: result.map( item => this.userDocumentToUserSafe(item))};
        } catch (err) {
            console.error(err);
        }
    }

    async getUserByAccountId(account_id: string): Promise<UserDocument> {
        try {
            const result = await this.userModel.findOne({account_id : account_id});
            return result;
        } catch (err) {
            console.error(err);
        }
    }

    async getUserByAccountIdSafe(account_id: string): Promise<UserSafeDto> {
        try {
            const result = await this.getUserByAccountId(account_id);
            if(!result) throw new Error("Account_id 없음");
            const resultUserSafe = {
                _id: result._id.toString(),
                name: result.name,
                email: result.email,
                account_id: result.account_id,
                about_me: result.about_me
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

    async getUserByIdSafe(id: string): Promise<UserSafeDto> {
        try {
            const result = await this.getUserById(id);
            if(!result) throw new Error("null user (temp error)");
            const resultUserSafe = {
                _id: result._id.toString(),
                name: result.name,
                email: result.email,
                account_id: result.account_id,
                about_me: result.about_me,
            }
            return resultUserSafe;
        } catch (err) {
            console.error(err);
        }
    }

    async updateUserById(
        jwtOwnerId: string, 
        updateReq: UserUpdateRequestDto
    ): Promise<UserUpdateResultDto> {
        try {
            const targetUser = await this.getUserById(jwtOwnerId);
            // const pwd_hash = await Bcrypt.hash(updateReq.password, 10);
            await targetUser.updateOne({
                name: updateReq.name,
                // pwd_hash: pwd_hash,
                about_me: updateReq.about_me
            })

            const updatedUserDoc = await this.getUserById(jwtOwnerId);
            
            const updatedUser: UserUpdateResultDto = {
                _id: updatedUserDoc._id.toString(),
                name: updatedUserDoc.name,
                email: updatedUserDoc.email,
                account_id: updatedUserDoc.account_id,
                about_me: updatedUserDoc.about_me,
                status: "success"
            } 
            
            return updatedUser;
        } catch (err) {
            console.error(err)
        }
    }

    async updatePassword(ownerId: string, userUpdatePasswordRequest: UserUpdatePasswordRequestDto): Promise<UserUpdateResultDto> {
        try {
            const targetuser = await this.getUserById(ownerId);

            //TODO : 비밀번호등의 인증 관련 내용은 auth모듈의 것을 사용하자
            const validateUser = await Bcrypt.compare(userUpdatePasswordRequest.oldPassword, targetuser.pwd_hash);
            console.log(validateUser);
            if (!validateUser) {
                // TODO : 해당 오류에 대한 graphQL 오류를 응답하자
                throw new error("비밀번호 오류");
            }
            const pwd_hash = await Bcrypt.hash(userUpdatePasswordRequest.newPassword, 10);
            await targetuser.updateOne({
                pwd_hash
            });

            const updatedUserDoc = await this.getUserById(ownerId);

            return {...this.userDocumentToUserSafe(updatedUserDoc), status: "success"}
        } catch (err) {
            console.error(err);
        }
    }


    async createUser(reqUser: UserCreateRequestDto): Promise<UserSafeDto> {
        try {

            const pwd_hash = await Bcrypt.hash(reqUser.password, 10);

            const createdUser = await this.userModel.create({
                name: reqUser.name,
                account_id: reqUser.account_id,
                email: reqUser.email,
                pwd_hash: pwd_hash,
                about_me: "",
                friends: []
            });
            await createdUser.save()

            const createdUserSafe: UserSafeDto = {
                _id : createdUser._id.toString(),
                name : createdUser.name,
                email : createdUser.email,
                account_id : createdUser.account_id,
                about_me: createdUser.about_me
            }

            return createdUserSafe;

        } catch (err) {
            console.error(err);
        }
    }

    async deleteUser(ownerId: string, deleteReq: UserDeleteRequestDto): Promise<UserDeleteResultDto> {
        const result = new UserDeleteResultDto;
        try{

            const targetUser = await this.getUserById(ownerId);
            const deleteResult = await targetUser.deleteOne();

            console.log(deleteResult);

            console.log(this.getUserById(ownerId));
            result.deleteStatus = true;
            
            return result;
        } catch (err) {
            console.error(err);
            result.deleteStatus = false;
            return result;
        }
    }
}
