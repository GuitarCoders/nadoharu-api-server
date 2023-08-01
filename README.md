<h1 align="center">
  ☀️ 나도하루 API Server
</h1>

Nest.JS와 GraphQL을 사용해보고 싶어 만든 마이크로 블로그형 SNS '나도하루'의 API Server입니다. 



## 🖥️ 사용해보기

### ⚙️ API 사용해보기

다음 링크에서 현재 테스트로 돌아가고 있는 서버에 API를 사용해볼 수 있습니다. ***쿼리 및 뮤테이션의 결과는 [JongCo](https://github.com/JongCo)의 개인 서버에 저장됩니다. 민감한 정보를 입력하지 마세요***

[나도하루 GraphQL PlayGround](http://nadoharu.duckdns.org/api/graphql)

로그인 후 인증은 Bearer토큰을 사용합니다. 현재 'login 쿼리', 'createUser 뮤테이션'을 제외한 모든 요청은 토큰을 요구합니다.

```
Http-Header{
	"Authorization": "Bearer <LoginToken>"
    ...
}
```


### 🏞️ 서비스 이용해보기

다음 링크에서 현재 테스트로 동작하는 서비스를 이용해볼 수 있습니다. ***계정 정보 및 작성한 글의 내용은 [JongCo](https://github.com/JongCo)의 개인 서버에 저장됩니다. 민감한 정보를 입력하지 마세요***

[나도하루 테스트 홈페이지](http://nadoharu.duckdns.org/)

나도하루의 테스트 홈페이지는 [Hyeongjin(KeMezz)](https://github.com/KeMezz)님의 [프로젝트](https://github.com/GuitarCoders/front)를 사용하고 있습니다.


## 📀 소스코드 직접 실행

본 프로젝트의 소스코드를 직접 실행하기 위해서는 다음과 같은 사전 준비가 필요합니다.
* node.js (작업환경 버전: 18.12.1) 설치
* npm (작업환경 버전: 8.19.2) 설치
* mongoDB (작업환경 버전: 1.8.2) 설치 및 실행

해당 리포지토리를 clone한 뒤, 프로젝트 파일의 최상위 디렉토리에 '.env.<환경이름>' 파일을 생성합니다. <환경이름>은 파일 이름으로 사용할 수 있다면 아무렇게 정해도 상관 없습니다. (예시, '.env.dev') 

'.env.<환경이름>' 의 파일 내용을 다음과 같이 지정합니다.

```
JWT_SECRET=<JWT 토큰 암/복호화를 위한 무작위 문자열>
MONGO_DB_URL=mongodb://<mongoDB 작동 네트워크 주소>:<mongoDB 작동 포트>
```

해당 파일을 작성하였다면 다음과 같은 명령어로 서버를 실행할 수 있습니다.
```shell
$ npm run start:<환경이름>
```

서버를 실행하면 mongoose라이브러리에 의해 mongoDB의 컬렉션이 자동으로 생성됩니다.

## 🛠️ 사용 기술

<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> <img src="https://img.shields.io/badge/nest.js-E0234E?style=for-the-badge&logo=nestjs&logoColor=white"> <img src="https://img.shields.io/badge/graphql-E10098?style=for-the-badge&logo=graphql&logoColor=white"> <img src="https://img.shields.io/badge/mongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white"> <img src="https://img.shields.io/badge/mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white">
