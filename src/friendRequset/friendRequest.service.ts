import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FriendRequest } from './schemas/friendRequest.schema';
import { Model } from 'mongoose';
import { CreateFriendRequestDto } from './dto/friendRequest.dto';

@Injectable()
export class FriendRequestService {
    constructor(@InjectModel(FriendRequest.name) private friendRequestModel: Model<FriendRequest>) {}

    async createFriendRequest(createFriendRequestDto: CreateFriendRequestDto): Promise<FriendRequest> {
        const test = new this.friendRequestModel(createFriendRequestDto);
        return test.save();
    }
}
