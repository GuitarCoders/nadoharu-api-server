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
import { UserSafeDto } from 'src/user/dto/user.dto';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { GraphQLError } from 'graphql';
import { FriendService } from 'src/friend/friend.service';

@Injectable()
export class FriendRequestService {
    constructor(
        private friendService: FriendService,
        @InjectModel(FriendRequest.name) private friendRequestModel: Model<FriendRequest>
    ) {}

    //TODO: 이 함수는 user.service로 넘어감. 여기서 지우고 의존성을 user로 넘기자
    userDocumentToUserSafe(doc: UserDocument): UserSafeDto{
        return {
            _id: doc._id.toString(),
            name: doc.name,
            email: doc.email,
            account_id: doc.account_id,
            about_me: doc.about_me,
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
                .find({requestUser: requestUserId})
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
                .find({receiveUser: receiveUserId})
                .populate('requestUser')
                .populate('receiveUser');

            console.log(result);

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
                requestUser: requestUserId,
                receiveUser: createFriendRequestDto.receiveUserId
            })
            console.log(alreadyFriendRequests);
            if(alreadyFriendRequests.length > 0) {
                throw new Error('이미 친구를 신청한 대상입니다.');
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
                requestUser: this.userDocumentToUserSafe(createdFriendResult.requestUser),
                receiveUser: this.userDocumentToUserSafe(createdFriendResult.receiveUser),
                requestMessage: createdFriendResult.requestMessage,
                createdAt: createdFriendResult.createdAt.toISOString(),
                success: true
            }
        } catch (err) {
            console.error(err);
            //TODO: 에러 코드를 프론트엔드 작업자와 합의하여 보낼 것 (처리하기 쉽게)
            //TODO: 에러에 분기를 만들자
            // throw new GraphQLError(
            //     '이미 친구를 신청한 대상입니다.'
            // );
        }
    }

    async deleteFriendRequest(deleteFriendRequestDto: DeleteFriendRequestDto): Promise<DeleteFriendRequestResultDto>{
        try {
            const targetFriendRequest = await this.getFriendRequestById(deleteFriendRequestDto.friendRequestId);
            if(!targetFriendRequest) {
                console.log("해당친추없음");
            }
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
            const targetFriendRequest = await this.friendRequestModel
                .findById(acceptFriendRequestDto.friendRequestId)
                .populate('requestUser')
                .populate('receiveUser');

            console.log(targetFriendRequest);

            if(!targetFriendRequest) {throw new Error('해당 친구신청이 존재하지 않습니다.')}
            if(acceptUserId !== targetFriendRequest.receiveUser._id.toString()) {throw new Error('다른사람의 친구신청을 승낙할 수 없습니다.')}

            this.friendService.addFriend(
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
