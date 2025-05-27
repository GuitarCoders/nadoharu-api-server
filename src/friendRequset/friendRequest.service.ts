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
import { GraphQLError } from 'graphql';
import { FriendService } from 'src/friend/friend.service';
import { UserService } from 'src/user/user.service';
import { NadoharuGraphQLError } from 'src/errors/nadoharuGraphQLError';

@Injectable()
export class FriendRequestService {
    constructor(
        private friendService: FriendService,
        private userService: UserService,
        @InjectModel(FriendRequest.name) private friendRequestModel: Model<FriendRequest>
    ) {}

    async getFriendRequestById(requestUserId: string, id: string): Promise<FriendRequestDocument> {
        try{
            const result = await this.friendRequestModel.findById(id)
                .populate('requestUser')
                .populate('receiveUser');;

            if (!result) {
                throw new NadoharuGraphQLError('FRIEND_REQUEST_NOT_EXIST');
            }
            
            if (
                result.requestUser._id.toString() !== requestUserId
                &&
                result.receiveUser._id.toString() !== requestUserId
            ) {
                throw new NadoharuGraphQLError('FRIEND_REQUEST_NOT_OWNED');
            }

            return result;
        } catch(err) {
            if (err instanceof GraphQLError) {
                throw err;
            }
            console.error(err);
        }
    }

    async getFriendRequestsByRequestUserId(requestUserId: string): Promise<FriendRequestArrayDto> {
        try{
            const result = await this.friendRequestModel
                .find({requestUser: requestUserId})
                .populate('requestUser')
                .populate('receiveUser');

            const resultToArray: FriendRequestDto[] = new Array();
            result.forEach( item => {
                resultToArray.push({
                    _id: item._id.toString(),
                    requestUser: this.userService.userDocumentToUserSafe(item.requestUser),
                    receiveUser: this.userService.userDocumentToUserSafe(item.receiveUser),
                    requestMessage: item.requestMessage,
                    createdAt: item.createdAt.toISOString()
                })
            })

            return {friendRequests: resultToArray};
        } catch(err) {
            
            console.error(err);

        }
    }

    async getFriendRequestsByReceiveUserId(receiveUserId: string): Promise<FriendRequestArrayDto> {
        try{
            const result = await this.friendRequestModel
                .find({receiveUser: receiveUserId})
                .populate('requestUser')
                .populate('receiveUser');

            console.log(result);

            const resultToArray: FriendRequestDto[] = new Array();
            result.forEach( item => {
                resultToArray.push({
                    _id: item._id.toString(),
                    requestUser: this.userService.userDocumentToUserSafe(item.requestUser),
                    receiveUser: this.userService.userDocumentToUserSafe(item.receiveUser),
                    requestMessage: item.requestMessage,
                    createdAt: item.createdAt.toISOString()
                })
            })

            return {friendRequests: resultToArray};
        } catch(err) {

            console.error(err);
            
        }
    }

    async getReceivedFriendRequestCount(receivedUserId: string): Promise<number> {
        return await this.friendRequestModel.count({
            receiveUser: receivedUserId
        });
    }

    async createFriendRequest(
        requestUserId: string,
        createFriendRequestDto: CreateFriendRequestDto
    ): Promise<CreateFriendRequestResultDto> {
        try{

            if(requestUserId === createFriendRequestDto.receiveUserId) {
                throw new NadoharuGraphQLError('FRIEND_REQUEST_TO_ME');
            }

            const alreadyFriendRequests = await this.friendRequestModel.find({
                requestUser: requestUserId,
                receiveUser: createFriendRequestDto.receiveUserId
            })
            
            if(alreadyFriendRequests.length > 0) {
                throw new NadoharuGraphQLError('FRIEND_REQUEST_DUPLICATED');
            }

            const createdFriendRequest = new this.friendRequestModel(
                {
                    requestUser: requestUserId,
                    receiveUser: createFriendRequestDto.receiveUserId,
                    requestMessage: createFriendRequestDto.requestMessage
                }
            );
            await createdFriendRequest.save();
            
            const createdFriendResult = 
                await this.friendRequestModel.findById(createdFriendRequest._id)
                    .populate('requestUser')
                    .populate('receiveUser');

            // return {...createdFriendResult, success: true}
            return {
                _id: createdFriendResult._id.toString(),
                requestUser: this.userService.userDocumentToUserSafe(createdFriendResult.requestUser),
                receiveUser: this.userService.userDocumentToUserSafe(createdFriendResult.receiveUser),
                requestMessage: createdFriendResult.requestMessage,
                createdAt: createdFriendResult.createdAt.toISOString(),
                success: true
            }
        } catch (err) {
            if (err instanceof GraphQLError) {
                throw err;
            }
            console.error(err);
        }
    }

    async deleteFriendRequest(requestUserId: string, deleteFriendRequestDto: DeleteFriendRequestDto): Promise<DeleteFriendRequestResultDto>{
        try {
            const targetFriendRequest = await this.getFriendRequestById(
                requestUserId,
                deleteFriendRequestDto.friendRequestId
            );
            
            await targetFriendRequest.deleteOne();

            return {
                success: true
            }
        } catch(err) {
            if (err instanceof GraphQLError) {
                throw err;
            }
            console.error(err);
        }
    }

    async acceptFriendRequest(
        acceptUserId: string, 
        acceptFriendRequestDto: AcceptFriendRequestDto
    ): Promise<AcceptFriendRequestResultDto> {
        try{
            const targetFriendRequest = await this.getFriendRequestById(
                acceptUserId,
                acceptFriendRequestDto.friendRequestId
            );

            if(acceptUserId !== targetFriendRequest.receiveUser._id.toString()) {
                throw new NadoharuGraphQLError('FRIEND_REQUEST_NOT_RECEIVED');
            }

            this.friendService.addFriend(
                targetFriendRequest.requestUser._id.toString(),
                targetFriendRequest.receiveUser._id.toString()
            )

            await targetFriendRequest.deleteOne();

            return {success: true}
        } catch (err) {
            if (err instanceof GraphQLError) {
                throw err;
            }
            console.log(err)
            return {success: false}
        }
    }
}
