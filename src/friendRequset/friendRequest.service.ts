import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FriendRequest, FriendRequestDocument } from './schemas/friendRequest.schema';
import { Model } from 'mongoose';
import { 
    CreateFriendRequestDto, 
    CreateFriendRequestResultDto,
    DeleteFriendRequestResultDto, 
    FriendRequestsQueryResultDto, 
    AcceptFriendRequestResultDto
} from './dto/friendRequest.dto';
import { GraphQLError } from 'graphql';
import { FriendService } from 'src/friend/friend.service';
import { UserService } from 'src/user/user.service';
import { NadoharuGraphQLError } from 'src/errors/nadoharuGraphQLError';
import { PaginationService } from 'src/pagination/pagination.service';
import { PaginationInput } from 'src/pagination/dto/pagination.dto';
import { FriendRequestMapper } from './mapper/friendRequest.mapper';

@Injectable()
export class FriendRequestService {
    constructor(
        private readonly FriendService: FriendService,
        private readonly UserService: UserService,
        private readonly PaginationService: PaginationService,
        private readonly FriendRequestMapper: FriendRequestMapper,
        @InjectModel(FriendRequest.name) private friendRequestModel: Model<FriendRequest>
    ) {}

    async getFriendRequestById(requestUserId: string, id: string): Promise<FriendRequestDocument> {
        try{
            const result = await this.friendRequestModel.findById(id)
                .populate('requester')
                .populate('receiver');;

            if (!result) {
                throw new NadoharuGraphQLError('FRIEND_REQUEST_NOT_EXIST');
            }
            
            if (
                result.requester._id.toString() !== requestUserId
                &&
                result.receiver._id.toString() !== requestUserId
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

    async getFriendRequestsByRequestUserId(
        requesterId: string,
        pagination: PaginationInput
    ): Promise<FriendRequestsQueryResultDto> {
        try{

            const friendRequestQuery 
                = this.friendRequestModel
                    .find({requester: requesterId})
                    .sort({createdAt: -1})
                    .populate('requester')
                    .populate('receiver');


            const {paginatedDoc: friendRequestDocuments, pageInfo} = await this.PaginationService.getPaginatedDocuments(pagination, friendRequestQuery);
                
            const friendRequests = friendRequestDocuments.map(
                item => this.FriendRequestMapper.toFriendRequestDto(item)
            );

            return {
                friendRequests,
                pageInfo
            };
        } catch(err) {
            
            console.error(err);

        }
    }

    async getFriendRequestsByReceiveUserId(
        receiverId: string,
        pagination: PaginationInput
    ): Promise<FriendRequestsQueryResultDto> {
         try{

            const friendRequestQuery 
                = this.friendRequestModel
                    .find({receiver: receiverId})
                    .populate('requester')
                    .populate('receiver');

            const {paginatedDoc: friendRequestDocuments, pageInfo} = await this.PaginationService.getPaginatedDocuments(
                pagination,
                friendRequestQuery
            );
                
            const friendRequests = friendRequestDocuments.map(
                item => this.FriendRequestMapper.toFriendRequestDto(item)
            );

            return {
                friendRequests,
                pageInfo
            };
        } catch(err) {
            
            console.error(err);

        }
    }

    async getReceivedFriendRequestCount(receiverId: string): Promise<number> {
        return await this.friendRequestModel.count({
            receiver: receiverId
        });
    }

    async createFriendRequest(
        requestUserId: string,
        createFriendRequestDto: CreateFriendRequestDto
    ): Promise<CreateFriendRequestResultDto> {
        try{

            if(requestUserId === createFriendRequestDto.receiver) {
                throw new NadoharuGraphQLError('FRIEND_REQUEST_TO_ME');
            }

            const alreadyFriendRequests = await this.friendRequestModel.find({
                requester: requestUserId,
                receiver: createFriendRequestDto.receiver
            })
            
            if(alreadyFriendRequests.length > 0) {
                throw new NadoharuGraphQLError('FRIEND_REQUEST_DUPLICATED');
            }

            const createdFriendRequest = new this.friendRequestModel(
                {
                    requester: requestUserId,
                    receiver: createFriendRequestDto.receiver,
                    requestMessage: createFriendRequestDto.requestMessage
                }
            );
            await createdFriendRequest.save();
            
            const createdFriendResult = 
                await this.friendRequestModel.findById(createdFriendRequest._id)
                    .populate('requester')
                    .populate('receiver');

            // return {...createdFriendResult, success: true}
            return {
                _id: createdFriendResult._id.toString(),
                requester: this.UserService.userDocumentToUserSafe(createdFriendResult.requester),
                receiver: this.UserService.userDocumentToUserSafe(createdFriendResult.receiver),
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

    async deleteFriendRequest(requesterId: string, friendRequestId: string): Promise<DeleteFriendRequestResultDto>{
        try {
            const targetFriendRequest = await this.getFriendRequestById(
                requesterId,
                friendRequestId
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
        friendRequestId: string
    ): Promise<AcceptFriendRequestResultDto> {
        try{
            const targetFriendRequest = await this.getFriendRequestById(
                acceptUserId,
                friendRequestId
            );

            if(acceptUserId !== targetFriendRequest.receiver._id.toString()) {
                throw new NadoharuGraphQLError('FRIEND_REQUEST_NOT_RECEIVED');
            }

            this.FriendService.addFriend(
                targetFriendRequest.requester._id.toString(),
                targetFriendRequest.receiver._id.toString()
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

    async hasSentFriendRequest(fromId: string, toId: string) {
        const friendRequestDocuments = await this.friendRequestModel.find({requester: fromId, receiver: toId});
        if (friendRequestDocuments?.length !== 0) {
            return true;
        } else {
            return false;
        } 
    }
}
