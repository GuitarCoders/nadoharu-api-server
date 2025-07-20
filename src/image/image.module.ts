import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageResolver } from './image.resolver';
import { Storage } from '@google-cloud/storage';

@Module({
  providers: [
    ImageService, 
    ImageResolver, 
    {
      provide: Storage,
      useFactory: () => {
        return new Storage({
          projectId: process.env.GOOGLE_CLOUD_PROJECT
        })
      }
    }
  ]
})
export class ImageModule {}
