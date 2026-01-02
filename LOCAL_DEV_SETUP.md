# 나도하루 로컬 개발 환경 설정 가이드

Docker를 사용하여 MongoDB와 MinIO(S3 대체)를 설정하고, 백엔드와 프론트엔드를 로컬에서 실행하는 방법을 설명합니다.

## 사전 요구사항

- Node.js v22.x 이상
- npm v10.x 이상
- Docker 설치 및 실행
  - macOS: Docker Desktop
  - Arch Linux: `sudo pacman -S docker && sudo systemctl start docker`

---

## Step 1: Docker로 MongoDB 실행

```bash
docker run -d \
  -p 27017:27017 \
  --name mongodb \
  mongo:latest
```

### 확인
```bash
docker ps | grep mongodb
```

---

## Step 2: Docker로 MinIO 실행

MinIO는 S3 호환 오브젝트 스토리지로, 로컬에서 AWS S3를 대체합니다.

```bash
docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  --name minio \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  minio/minio server /data --console-address ":9001"
```

### 확인
```bash
docker ps | grep minio
```

---

## Step 3: MinIO 버킷 생성

1. 브라우저에서 `http://localhost:9001` 접속
2. 로그인
   - Username: `minioadmin`
   - Password: `minioadmin`
3. 좌측 메뉴에서 **Buckets** 클릭
4. **Create Bucket** 클릭
5. Bucket Name에 `nadoharu-images` 입력
6. **Create Bucket** 버튼 클릭

---

## Step 4: 백엔드 환경 변수 설정

`nadoharu-api-server` 프로젝트 루트에 `.env.dev` 파일을 생성합니다:

```bash
# nadoharu-api-server/.env.dev

# JWT 설정
JWT_SECRET=your_random_secret_string_here

# MongoDB 설정
MONGO_DB_URL=mongodb://localhost:27017/nadoharu

# 서버 포트
PORT=4000

# S3/MinIO 설정
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_S3_BUCKET_NAME=nadoharu-images
S3_ENDPOINT=http://localhost:9000
```

> **참고**: `JWT_SECRET`은 임의의 문자열로 설정하면 됩니다.

---

## Step 5: 백엔드 실행

```bash
cd nadoharu-api-server

# 의존성 설치
npm install

# 개발 서버 실행
npm run start:dev
```

### 확인
- 서버가 정상 실행되면 `http://localhost:4000/graphql`에서 GraphQL Playground에 접속할 수 있습니다.

---

## Step 6: 프론트엔드 환경 변수 설정

`nadoharu-front` 프로젝트 루트에 `.env.local` 파일을 생성합니다:

```bash
# nadoharu-front/.env.local

# GraphQL API 엔드포인트 (백엔드 주소)
NEXT_PUBLIC_GRAPHQL_API=http://localhost:4000/graphql

# 세션 암호화 키 (32자 이상 권장)
COOKIE_PASSWORD=your_cookie_password_at_least_32_characters
```

---

## Step 7: 프론트엔드 실행

```bash
cd nadoharu-front

# 의존성 설치
yarn

# 개발 서버 실행
yarn dev
```

### 확인
- 브라우저에서 `http://localhost:3000` 접속

---

## (선택) MongoDB Compass로 DB 열람

GUI로 DB를 확인하고 싶다면 MongoDB Compass를 사용하세요.

```bash
# macOS
brew install --cask mongodb-compass

# Arch Linux (AUR)
yay -S mongodb-compass-bin
```

설치 후 연결:
- URI: `mongodb://localhost:27017`
- Database: `nadoharu`

---

## 전체 서비스 구성도

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │     │    Backend      │     │    MongoDB      │
│  localhost:3000 │────>│  localhost:4000 │────>│  localhost:27017│
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               │ (이미지 업로드)
                               v
                        ┌─────────────────┐
                        │     MinIO       │
                        │  localhost:9000 │
                        │  Console: 9001  │
                        └─────────────────┘
```

---

## 프로덕션 배포 시

로컬 개발 환경에서 프로덕션으로 전환할 때:

1. **백엔드**: `.env.prod`에서 `S3_ENDPOINT`를 제거하면 자동으로 AWS S3를 사용합니다.
2. **프론트엔드**: `NEXT_PUBLIC_GRAPHQL_API`를 프로덕션 API 주소로 변경합니다.
