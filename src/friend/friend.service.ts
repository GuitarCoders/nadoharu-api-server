import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersSafeDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { Friend } from './schemas/friend.schema';

@Injectable()
export class FriendService {
    constructor(
        private UserService: UserService,
        @InjectModel(Friend.name) private FriendModel: Model<Friend>
    ) {}

    async addFriend(requestUserId: string, receiveUserId: string): Promise<boolean>{
        try {
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
        // option: getFriendDto
    ): Promise<UsersSafeDto> {
        try{
            const FriendDocuments = await this.FriendModel
                                          .find({owner: targetUserId})
                                          .sort({createdAt:1})
                                          .select('-owner')
                                          .populate('friend');
            console.log(FriendDocuments);
            
            return  {Users: FriendDocuments.map( doc => this.UserService.userDocumentToUserSafe(doc.friend))};
        } catch (err) {
            
        }
    }
}
