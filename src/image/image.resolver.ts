import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { ImageUploadInfo } from './dto/image.dto';
import { randomBytes } from 'crypto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Resolver()
export class ImageResolver {
    constructor(
        private readonly s3Client: S3Client
    ) {}

    @UseGuards(GqlAuthGuard)
    @Query(() => ImageUploadInfo)
    async requestImageUploadUrl(): Promise<ImageUploadInfo> {
        // 완전 랜덤 해시 파일명 생성 (32바이트 = 64자리 hex)
        const randomFileName = randomBytes(32).toString('hex');

        const putObjectCommand = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: randomFileName,
            ContentType: 'image/*'
        })

        const uploadUrl = await getSignedUrl(
            this.s3Client,
            putObjectCommand,
            {
                expiresIn: 15 * 60
            }
        );

        const publicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${randomFileName}`;

        return {
            uploadUrl,
            publicUrl
        };
    }
}
