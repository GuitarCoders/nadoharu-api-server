import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ImageUploadInfo } from './dto/image.dto';
import { randomBytes } from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class ImageService {
    constructor(
        private readonly s3Client: S3Client
    ) {}

    async requestImageUploadUrl(): Promise<ImageUploadInfo> {
        const randomFileName = randomBytes(32).toString('hex');

        const putObjectCommand = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: randomFileName,
            ContentType: 'image/*'
        });

        const uploadUrl = await getSignedUrl(
            this.s3Client,
            putObjectCommand,
            {
                expiresIn: 15 * 60
            }
        )

        const publicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${randomFileName}`;

        return {
            uploadUrl,
            publicUrl
        }

    }
}
