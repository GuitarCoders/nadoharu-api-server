import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FriendRequest } from './schemas/friendRequest.schema';
import { Model } from 'mongoose';
import { CreateFriendRequestDto, CreateFriendResultDto, FriendRequestDto } from './dto/friendRequest.dto';

@Injectable()
export class FriendRequestService {
    constructor(@InjectModel(FriendRequest.name) private friendRequestModel: Model<FriendRequest>) {}

    async createFriendRequest(createFriendRequestDto: CreateFriendRequestDto): Promise<CreateFriendResultDto> {
        try{
            const createdFriendRequest = new this.friendRequestModel(
                {
                    requestUserId: createFriendRequestDto.requestUserId,
                    receiveUserId: createFriendRequestDto.receiveUserId,
                    requestMessage: createFriendRequestDto.requestMessage
                }
            );
            createdFriendRequest.save();

            const leanCreatedFriendRequest = createdFriendRequest.toObject();
            
            const createFriendResult = {
                _id: createdFriendRequest._id.toString(),
                requestUserId: createdFriendRequest.requestUserId._id.toString(),
                receiveUserId: createdFriendRequest.receiveUserId._id.toString(),
                requestMessage: createdFriendRequest.requestMessage,
                createdAt: createdFriendRequest.createdAt.toISOString(),
                success: false
            }
            
            return createFriendResult
        } catch {

        }
    }


    //TODO : 필요없어보이면 지우자
    async createFriendRequestTest(reqData: CreateFriendRequestDto): Promise<CreateFriendResultDto>{

        const createdFriendRequest = new this.friendRequestModel(
            {
                requestUserId: reqData.requestUserId,
                receiveUserId: reqData.receiveUserId,
                requestMessage: reqData.requestMessage
            }
        )
        await createdFriendRequest.save()

        return {
            _id: "test",
            requestUserId: "test",
            receiveUserId: "test",
            requestMessage: "test",
            createdAt: "test",
            success: true
        }
    }
}
