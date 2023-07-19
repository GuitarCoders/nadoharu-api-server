import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersSafeDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { FriendsDto, getFriendsDto } from './dto/friend.dto';
import { Friend, FriendDocument } from './schemas/friend.schema';

@Injectable()
export class FriendService {
    constructor(
        private UserService: UserService,
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
        option: getFriendsDto
    ): Promise<FriendsDto> {
        try{

            const FriendQuery = this.FriendModel
                                .find({owner: option.targetUserId ? option.targetUserId : targetUserId})
                                .sort({createdAt:-1});

            if (option?.skip){
                FriendQuery.skip(option.skip);
            }

            FriendQuery.limit(option.limit);

            const FriendDocuments = await FriendQuery.populate('owner').populate('friend');

            const Friends = FriendDocuments.map( item => ({
                _id: item._id.toString(),
                user: this.UserService.userDocumentToUserSafe(item.friend),
                createdAt: item.createdAt.toISOString()
            }))
            
            return {friends: Friends}
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
}
