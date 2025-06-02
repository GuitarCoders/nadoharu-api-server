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
                .populate('requestUser')
                .populate('receiveUser');;

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
    ): Promise<FriendRequestArrayDto> {
        try{

            const friendRequestQuery 
                = this.friendRequestModel
                    .find({requestUser: requesterId})
                    .sort({createdAt: -1})
                    .populate('requestUser')
                    .populate('receiveUser');

            const { countOnlyQuery } 
                = this.PaginationService.buildPaginationQuery(pagination, friendRequestQuery)

            const friendRequestCount = await countOnlyQuery.count();
            const friendRequestDocuments = await friendRequestQuery;
                
            const friendRequests = friendRequestDocuments.map(
                item => this.FriendRequestMapper.toFriendRequestDto(item)
            );

            return {friendRequests};
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
                    requester: this.UserService.userDocumentToUserSafe(item.requester),
                    receiver: this.UserService.userDocumentToUserSafe(item.receiver),
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

            if(requestUserId === createFriendRequestDto.receiver) {
                throw new NadoharuGraphQLError('FRIEND_REQUEST_TO_ME');
            }

            const alreadyFriendRequests = await this.friendRequestModel.find({
                requestUser: requestUserId,
                receiveUser: createFriendRequestDto.receiver
            })
            
            if(alreadyFriendRequests.length > 0) {
                throw new NadoharuGraphQLError('FRIEND_REQUEST_DUPLICATED');
            }

            const createdFriendRequest = new this.friendRequestModel(
                {
                    requestUser: requestUserId,
                    receiveUser: createFriendRequestDto.receiver,
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
