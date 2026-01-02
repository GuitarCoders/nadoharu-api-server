import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageResolver } from './image.resolver';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  providers: [
    ImageService, 
    ImageResolver, 
    {
      provide: S3Client,
      useFactory: () => {
        return new S3Client({
          region: process.env.AWS_REGION,
          endpoint: process.env.S3_ENDPOINT || undefined,
          forcePathStyle: !!process.env.S3_ENDPOINT,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
          }
        })
      }
    }
  ]
})
export class ImageModule {}
