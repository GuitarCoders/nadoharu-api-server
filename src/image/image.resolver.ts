import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { ImageUploadInfo } from './dto/image.dto';
import { randomBytes } from 'crypto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ImageService } from './image.service';

@Resolver()
export class ImageResolver {
    constructor(
        private readonly ImageService: ImageService
    ) {}

    @UseGuards(GqlAuthGuard)
    @Query(() => ImageUploadInfo)
    async requestImageUploadUrl(): Promise<ImageUploadInfo> {
        return await this.ImageService.requestImageUploadUrl();
    }
}
