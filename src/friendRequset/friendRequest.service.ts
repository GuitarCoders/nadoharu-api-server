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
import { UserSafe } from 'src/user/models/user.model';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { GraphQLError } from 'graphql';

@Injectable()
export class FriendRequestService {
    constructor(
        private userService: UserService,
        @InjectModel(FriendRequest.name) private friendRequestModel: Model<FriendRequest>
    ) {}

    userDocumentToUserSafe(doc: UserDocument): UserSafe{
        return {
            _id: doc._id.toString(),
            name: doc.name,
            email: doc.email,
            account_id: doc.account_id,
            about_me: doc.about_me,
            friends: doc.friends?.map(objectId => objectId.toString())
        }
    }

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
            const result = await this.friendRequestModel
                .find({requestUserId: requestUserId})
                .populate('requestUser')
                .populate('receiveUser');

            const resultToArray: FriendRequestDto[] = new Array();
            result.forEach( item => {
                resultToArray.push({
                    _id: item._id.toString(),
                    requestUser: this.userDocumentToUserSafe(item.requestUser),
                    receiveUser: this.userDocumentToUserSafe(item.receiveUser),
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
                .find({receiveUserId: receiveUserId})
                .populate('requestUser')
                .populate('receiveUser');

            const resultToArray: FriendRequestDto[] = new Array();
            result.forEach( item => {
                resultToArray.push({
                    _id: item._id.toString(),
                    requestUser: this.userDocumentToUserSafe(item.requestUser),
                    receiveUser: this.userDocumentToUserSafe(item.receiveUser),
                    requestMessage: item.requestMessage,
                    createdAt: item.createdAt.toISOString()
                })
            })

            return {friendRequests: resultToArray};
        } catch(err) {

            console.error(err);
            
        }
    }

    // TODO : 파라미터를 두개 받는게 유연한건지 한번 생각해보자.
    async createFriendRequest(
        requestUserId: string,
        createFriendRequestDto: CreateFriendRequestDto
    ): Promise<CreateFriendRequestResultDto> {
        try{

            const alreadyFriendRequests = await this.friendRequestModel.find({
                receiveUser: createFriendRequestDto.receiveUserId
            })
            if(alreadyFriendRequests.length > 0) {
                throw new Error('이미 친구를 신청한 대상입니다.')
            } 

            const createdFriendRequest = new this.friendRequestModel(
                // {
                //     requestUser: requestUserId,
                //     receiveUser: createFriendRequestDto.receiveUserId,
                //     requestMessage: createFriendRequestDto.requestMessage
                // }
                {
                    requestUser: requestUserId,
                    receiveUser: createFriendRequestDto.receiveUserId,
                    requestMessage: createFriendRequestDto.requestMessage
                }
            );
            await createdFriendRequest.save();
            
            const createdFriendResult:CreateFriendRequestResultDto = 
                await this.friendRequestModel.findById(createdFriendRequest._id)
                    .populate('requestUser')
                    .populate('receiveUser');            
            return createdFriendResult
        } catch (err) {
            console.error(err);
            throw new GraphQLError(
                '이미 친구를 신청한 대상입니다.'
            );
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

            if(acceptUserId !== targetFriendRequest.receiveUser._id.toString()) {throw new Error('다른사람의 친구신청을 승낙할 수 없습니다.')}

            this.userService.addFriend(
                targetFriendRequest.requestUser._id.toString(),
                targetFriendRequest.receiveUser._id.toString()
            )

            await targetFriendRequest.deleteOne();

            return {success: true}
        } catch (err) {
            console.log(err)
            return {success: false}
        }
    }
}
