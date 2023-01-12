import { Model, Document, ObjectId, LeanDocument } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema } from './schemas/user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async getUserByAccountId(account_id: string): Promise<LeanDocument<UserDocument>> {
        try {
            const result = await this.userModel.findOne({account_id});
            // return result;
            const test = new this.userModel({
                name: "a",
                account_id: "b",
                email: "a",
                pwd_salt: "a",
                pwd_hash: "c",
                friends: []
            });
            return test.toObject();
        } catch (err) {
            console.error(err);
        }
    }
}
