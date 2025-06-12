import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { FriendsQueryResultDto } from './dto/friend.dto';
import { Friend, FriendDocument } from './schemas/friend.schema';
import { PaginationInput } from 'src/pagination/dto/pagination.dto';
import { PaginationService } from 'src/pagination/pagination.service';

@Injectable()
export class FriendService {
    constructor(
        private readonly UserService: UserService,
        private readonly PaginationService: PaginationService,
        @InjectModel(Friend.name) private FriendModel: Model<Friend>
    ) {}

    async addFriend(requestUserId: string, receiveUserId: string): Promise<boolean>{
        try {

            if(requestUserId === receiveUserId) {
                throw new Error("자신을 친구로 등록할 수 없습니다.");
            }

            const requesterFriendDocument = await this.FriendModel.create({
                owner: requestUserId,
                friend: receiveUserId,
            })
            const receiverFriendDocument = await this.FriendModel.create({
                owner: receiveUserId,
                friend: requestUserId
            })
    
            await requesterFriendDocument.save();
            await receiverFriendDocument.save();
    
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async getFriends(
        targetUserId: string,
        pagination: PaginationInput,
    ): Promise<FriendsQueryResultDto> {
        try{
            console.log(targetUserId);
            const friendQuery = this.FriendModel
                                .find({owner: targetUserId})
                                .populate('owner')
                                .populate('friend');

            const {
                paginatedDoc: friendDocuments,
                pageInfo
            } = await this.PaginationService.getPaginatedDocuments(pagination, friendQuery);

            const Friends = friendDocuments.map( item => ({
                _id: item._id.toString(),
                user: this.UserService.userDocumentToUserSafe(item.friend),
                createdAt: item.createdAt.toISOString()
            }))


            
            return {
                friends: Friends,
                pageInfo
            }
        } catch (err) {
            
        }
    }

    async getFriendDocuments(
        targetUserId: string,
    ): Promise<FriendDocument[]> {
        try{
            return await this.FriendModel.find({owner: targetUserId});
        } catch (err) {

        }
    }

    async checkFriend(userId_1: string, userId_2: string): Promise<boolean> {
        try {
            const friendDocument = await this.FriendModel.findOne({
                owner: userId_1,
                friend: userId_2
            })

            console.log(friendDocument);

            if(!friendDocument){
                return false;
            } else {
                return true;
            }
        } catch (err) {
            console.error(err);
        }
    }

    async getFriendCount(userId: string) {
        try {
            const friendCount = await this.FriendModel.count({
                owner:userId
            });

            return friendCount;
        } catch (e) {
            console.error(e);
        }
    }
}
