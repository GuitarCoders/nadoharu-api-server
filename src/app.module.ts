import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

console.log(process.env.NODE_ENV);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.', process.env.NODE_ENV].join("")
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_URL)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
