import { Storage } from '@google-cloud/storage';
import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { ImageUploadInfo } from './dto/image.dto';
import { randomBytes } from 'crypto';

@Resolver()
export class ImageResolver {
    constructor(
        private readonly storage: Storage
    ) {}

    @UseGuards(GqlAuthGuard)
    @Query(() => ImageUploadInfo)
    async requestImageUploadUrl(): Promise<ImageUploadInfo> {
        // 완전 랜덤 해시 파일명 생성 (32바이트 = 64자리 hex)
        const randomFileName = randomBytes(32).toString('hex');
        
        const options = {
            version: 'v4' as const,
            action: 'write' as const,
            expires: Date.now() + 15 * 60 * 1000
        };

        const [uploadUrl] = await this.storage
            .bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME)
            .file(randomFileName)
            .getSignedUrl(options);

        const publicUrl = `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME}/${randomFileName}`;

        return {
            uploadUrl,
            publicUrl
        };
    }
}
