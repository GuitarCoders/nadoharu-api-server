import mongoose, { Model, Document, ObjectId, LeanDocument, UpdateWriteOpResult } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as Bcrypt from 'bcrypt'

import { User, UserDocument, UserSchema } from './schemas/user.schema';
import { UserCreateRequestDto, UserDeleteRequestDto, UserDeleteResultDto, UserSafeDto, UsersSafeDto, UserUpdateRequestDto, UserUpdateResultDto } from './dto/user.dto';

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


    async createUser(reqUser: UserCreateRequestDto): Promise<UserSafeDto> {
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

    //jwtOwnerId -> ownerId 이쪽이 좀더 의도에 맞는 듯.
    //함수가 이게 jwt를 타고 오는건지 알 필요가 없다.
    async deleteUser(jwtOwnerId: string, deleteReq: UserDeleteRequestDto): Promise<UserDeleteResultDto> {
        const result = new UserDeleteResultDto;
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
    //TODO : 사용하지 않음
    /** @deprecated 해당 기능은 Friend부분이 처리합니다. */
    async addFriend(
        acceptUserId: string, 
        reqUserId: string)
    : Promise<any> {

        try {
            const acceptUser = await this.getUserById(acceptUserId);
            const requestUser = await this.getUserById(reqUserId);

            // acceptUser.friends.push(requestUser._id);
            await acceptUser.updateOne({$addToSet: {friends: requestUser._id}});
            // requestUser.friends.push(acceptUser._id);
            await requestUser.updateOne({$addToSet: {friends: acceptUser._id}});

            // await acceptUser.save();
            // await requestUser.save();
    
            return {success: true};

        } catch {
            return {success: false};
        }


    }
}
