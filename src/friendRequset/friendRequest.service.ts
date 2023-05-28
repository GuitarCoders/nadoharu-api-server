import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FriendRequest, FriendRequestDocument } from './schemas/friendRequest.schema';
import { Model } from 'mongoose';
import { CreateFriendRequestDto, CreateFriendRequestResultDto, DeleteFriendRequestDto, DeleteFriendRequestResultDto, FriendRequestDto } from './dto/friendRequest.dto';

@Injectable()
export class FriendRequestService {
    constructor(@InjectModel(FriendRequest.name) private friendRequestModel: Model<FriendRequest>) {}

    async getFriendRequestById(id: string): Promise<FriendRequestDocument> {
        try{
            const result = this.friendRequestModel.findById(id);

            return result;
        } catch(err) {
            console.error(err);
        }
    }

    // TODO : 이미 같은 친구에게 친추를 걸었는지 확인하는 과정을 추가하자
    async createFriendRequest(createFriendRequestDto: CreateFriendRequestDto): Promise<CreateFriendRequestResultDto> {
        try{
            const createdFriendRequest = new this.friendRequestModel(
                {
                    requestUserId: createFriendRequestDto.requestUserId,
                    receiveUserId: createFriendRequestDto.receiveUserId,
                    requestMessage: createFriendRequestDto.requestMessage
                }
            );
            await createdFriendRequest.save();
            
            const createFriendResult = {
                _id: createdFriendRequest._id.toString(),
                requestUserId: createdFriendRequest.requestUserId._id.toString(),
                receiveUserId: createdFriendRequest.receiveUserId._id.toString(),
                requestMessage: createdFriendRequest.requestMessage,
                createdAt: createdFriendRequest.createdAt.toISOString(),
                success: true
            }
            
            return createFriendResult
        } catch {

        }
    }

    async deleteFriendRequest(deleteFriendRequestDto: DeleteFriendRequestDto): Promise<DeleteFriendRequestResultDto>{
        try {
            const targetFriendRequest = await this.getFriendRequestById(deleteFriendRequestDto.friendRequestId);
            await targetFriendRequest.deleteOne();

            return {
                success: true
            }
        } catch(err) {
            console.error(err);
        }
    }
}
