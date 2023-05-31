import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FriendRequest, FriendRequestDocument } from './schemas/friendRequest.schema';
import { Model } from 'mongoose';
import { 
    CreateFriendRequestDto, 
    CreateFriendRequestResultDto, 
    DeleteFriendRequestDto, 
    DeleteFriendRequestResultDto, 
    FriendRequestArrayDto, 
    FriendRequestDto,
    AcceptFriendRequestDto,
    AcceptFriendRequestResultDto
} from './dto/friendRequest.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FriendRequestService {
    constructor(
        private userService: UserService,
        @InjectModel(FriendRequest.name) private friendRequestModel: Model<FriendRequest>
    ) {}

    async getFriendRequestById(id: string): Promise<FriendRequestDocument> {
        try{
            const result = await this.friendRequestModel.findById(id);

            return result;
        } catch(err) {
            console.error(err);
        }
    }

    async getFriendRequestsByRequestUserId(requestUserId: string): Promise<FriendRequestArrayDto> {
        try{
            const result = await this.friendRequestModel.find({requestUserId: requestUserId});

            const resultToArray: FriendRequestDto[] = new Array();
            result.forEach( item => {
                resultToArray.push({
                    _id: item._id.toString(),
                    requestUserId: item.requestUserId._id.toString(),
                    receiveUserId: item.receiveUserId._id.toString(),
                    requestMessage: item.requestMessage,
                    createdAt: item.createdAt.toISOString()
                })
            })

            return {friendRequests: resultToArray};
        } catch(err) {
            
            console.error(err);

        }
    }

    // TODO : 이미 같은 친구에게 친추를 걸었는지 확인하는 과정을 추가하자
    // TODO : 파라미터를 두개 받는게 유연한건지 한번 생각해보자.
    async createFriendRequest(
        requestUserId: string,
        createFriendRequestDto: CreateFriendRequestDto
    ): Promise<CreateFriendRequestResultDto> {
        try{
            const createdFriendRequest = new this.friendRequestModel(
                {
                    requestUserId: requestUserId,
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

    async acceptFriendRequest(
        acceptUserId: string, 
        acceptFriendRequestDto: AcceptFriendRequestDto
    ): Promise<AcceptFriendRequestResultDto> {
        try{
            const targetFriendRequest = await this.friendRequestModel.findById(acceptFriendRequestDto.friendRequestId);

            if(acceptUserId !== targetFriendRequest.receiveUserId._id.toString()) {throw new Error('다른사람의 친구신청을 승낙할 수 없습니다.')}

            this.userService.addFriend(
                targetFriendRequest.requestUserId._id.toString(),
                targetFriendRequest.receiveUserId._id.toString()
            )

            await targetFriendRequest.deleteOne();

            return {success: true}
        } catch (err) {
            console.log(err)
            return {success: false}
        }
    }
}
