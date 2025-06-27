import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo'

import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { FriendRequestModule } from './friendRequset/friendRequest.module';
import { PostModule } from './post/post.module';
import { FriendModule } from './friend/friend.module';
import { TestModule } from './test/test.module';
import { CommentModule } from './comment/comment.module';
import { UserInfoModule } from './userInfo/userInfo.module';
import { PaginationModule } from './pagination/pagination.module';
import { NadoModule } from './nado/nado.module';


console.log(process.env.NODE_ENV);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.', process.env.NODE_ENV].join(""),
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_URL),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      // cors: {
      //   origin: "*",
      // },
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql')
    }),
    UserModule,
    AuthModule,
    FriendRequestModule,
    PostModule,
    FriendModule,
    TestModule,
    CommentModule,
    UserInfoModule,
    PaginationModule,
    NadoModule
  ],
  providers: [AppService],
})
export class AppModule {}