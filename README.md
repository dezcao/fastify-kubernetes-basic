## Fastify + Kubernetes API 서버 템플릿

Fastify, Kubernetes, Redis, MariaDB, PostgreSQL을 사용하여 확장 가능한 API 서버 탬플릿을 구성한다.

## 🚀 빠른 시작 (Quick Start)

```sh
# 1. 패키지 설치
npm install

# 3. Fastify 서버 실행
npm run dev
```

- Kubernetes인 경우. (설치는 DockerOriginal.md, DockerKubernetes.md 참조)

```sh
# Minikube
minikube start

# redis
kubectl apply -f redis-deployment.yaml
kubectl get pods

kubectl apply -f redis-service.yaml
kubectl get services

# mariadb
kubectl apply -f mariadb-statefulset.yaml
kubectl get pods

kubectl apply -f mariadb-service.yaml
kubectl get services

# postgre
# kubectl apply -f postgre-statefulset.yaml
# kubectl apply -f postgre-service.yaml

# fastify node.js App
./deploy-fastify.sh
kubectl get pods
kubectl logs fastify-deployment-xxx-xxx
```

- Minikube 실행 예상 결과

```
😄  minikube v1.35.0 on Microsoft Windows 11 Home 10.0.26100.2894 Build 26100.2894
✨  Using the docker driver based on existing profile
👍  Starting "minikube" primary control-plane node in "minikube" cluster
🚜  Pulling base image v0.0.46 ...
🔄  Restarting existing docker container for "minikube" ...
❗  Failing to connect to https://registry.k8s.io/ from inside the minikube container
💡  To pull new external images, you may need to configure a proxy: https://minikube.sigs.k8s.io/docs/reference/networking/proxy/
🐳  Preparing Kubernetes v1.32.0 on Docker 27.4.1 ...
🔎  Verifying Kubernetes components...
    ▪ Using image gcr.io/k8s-minikube/storage-provisioner:v5
    ▪ Using image docker.io/kubernetesui/dashboard:v2.7.0
    ▪ Using image docker.io/kubernetesui/metrics-scraper:v1.0.8
💡  Some dashboard features require the metrics-server addon. To enable all features please run:

        minikube addons enable metrics-server

🌟  Enabled addons: default-storageclass, storage-provisioner, dashboard

❗  C:\Program Files\Docker\Docker\resources\bin\kubectl.exe is version 1.30.5, which may have incompatibilities with Kubernetes 1.32.0.
    ▪ Want kubectl v1.32.0? Try 'minikube kubectl -- get pods -A'
🏄  Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default
```

- deploy-fastify.sh 실행 예상 결과

```
pod "fastify-deployment-bbd7c7d8c-7jxdz" deleted
pod "fastify-deployment-bbd7c7d8c-b7t8t" deleted
Fastify Deployment 다시 배포...
deployment.apps/fastify-deployment unchanged
Fastify Service 다시 배포...
service/fastify-service unchanged
Fastify 실행 상태 확인...
NAME                                 READY   STATUS    RESTARTS   AGE
fastify-deployment-bbd7c7d8c-5h2m8   1/1     Running   0          32s
fastify-deployment-bbd7c7d8c-5lbcb   1/1     Running   0          32s
Fastify 서비스 URL 확인:
http://127.0.0.1:52713
❗  Because you are using a Docker driver on windows, the terminal needs to be open to run it.
```

- Browser url test
  - ex, Mariadb - /routes/mariadbCheck.js
  1. /users
  2. /add-user?name=John&email=john@example.com

## Tech Stack

- Backend: Fastify (ESM, JSON Schema, Swagger, CORS, Helmet)
- Database: MariaDB, PostgreSQL (TypeORM X, 직접 커넥션 관리)
- Caching: Redis
- Testing: Jest + Supertest
- Deployment: Kubernetes (Minikube) + Docker
- CI/CD: (추후 추가 예정)

## Fastify, Express, Nest 비교

| 프레임워크 | 특징                                | 장점                                                       | 단점                                       |
| ---------- | ----------------------------------- | ---------------------------------------------------------- | ------------------------------------------ |
| `Express`  | 가장 널리 사용되 프레임워크         | 유연함. 커뮤니티 풍부. 미들웨어 생태게 풍부.               | 유연한 구조란 자기가 해야 한다는 뜻이기도. |
| `Fastify`  | 성능에 초점. JSON Schema 기반 검증. | 빠름. 플러그인 기반 구조로 확장성 좋음. TypeScript 친화적. | 생태계가 작음.                             |
| `NestJS`   | Angular 스타일. TypeScript 기반.    | 모듈, DI                                                   | Express, Fastify 보다 상대적으로 무거움.   |

## Fastify를 선택한 이유.

1. 고속, 경량 - Express, Nest보다 가볍고 빠름.
2. Microservice 아키텍처와 궁합이 좋음.
3. 학습곡선 - 목적 달성이 쉽다는 이유가 배척의 원인이 될 수 없음.
4. 생태계 - database, 보안, 소셜 등 필요한 구성에는 문제가 없음. 가능하다는 모든 라이브러리를 가지려는게 아님.
5. 구조 - 프로젝트별 특성에 맞게 일부 수정은 필요 할 수 있음. 그러나, 한번 잡은 구조를 전면 재구성할 가능성은 적음.
6. JSON Schema 기반의 추가기능과 성능 최적화 - serialization, validation. 스웨거와 궁합 좋음.

## TypeScript를 전면적으로 사용하지 않은 이유.

1. 생산성 저하 - 모든 곳에 타입을 정의하는 시간이 투자됨.
2. 유지보수 비용 증가 - 프로젝트가 커지면 타입 정의가 점점 복잡해짐.
3. JavaScript의 동적 특성을 제한 - 동적 객체 확장, 프로토타입 조작 등 제약이 생김.
4. 생태계의 불완전한 타입지원 - 모든 라이브러리가 타입스크립트를 지원하지는 않음.
5. 과도한 코드 복잡성 - 타입스크립트를 적극적으로 사용할 수록 복잡도가 올라감.

### schema에만 적용.

1. 빌드 속도 저하를 최소화.
2. 공통스키마 변경시 코드 인라인에서 즉시 오류 감지.

| schema 내장기능 및 플러그인 | 추가설명         |
| --------------------------- | ---------------- |
| 요청 및 응답 데이터 검증    | schema.response  |
| 자동 API 문서화             | @fastify/swagger |
| 스키마 재사용               | addSchema()      |

### ESM(ECMAScript Modules) 방식으로 Node.js, TypeScript 수행시 import문 확장자

🎯중요 - .js로 가져올 것.🎯
hello.ts로 스키마를 ts파일로 하였더라도,
사용하는 route나 service 로직에서는 hello.js로 확장자를 js인 상태로 가져올 것.
이것이, 빌드 후에 파일의 경로를 일치시키기 위한 가장 단순하고 안전한 방법임.

### 실행문의 변경.

tsx라이브러리 설치가 된 상태에서 다음과 같은 package.json 실행 스크립트를 추가하였음.

"dev": "npx tsx src/server.js",

```
npm run dev
```

## controller 계층 별도로 만들지 않음.

routes 폴더의 각 라우트파일들 (user.js 등)을 컨트롤러 역할을 하도록, 비지니스 로직만 services/ 폴더로 분리함.

1. 구조 단순화
2. 작업의 직관성 향상
3. Fastify 철학과 일치시킴 - MSA 최적화. 불필요한 계층을 강요하지 않음. Spring 구조를 흉내 낼 필요 없음.
4. 비지니스 로직 분리만으로도 재사용성을 높일 수 있음.
5. 계층이 줄어 호출 스택이 짧아짐.
6. 유지 보수성 향상

## Test (Jest, Supertest)

| 테스트 도구  | 장점                                         | 단점                                                       |
| ------------ | -------------------------------------------- | ---------------------------------------------------------- |
| jest         | 설정이 쉬움. Mocking, 빠른 실행속도          | 다소 무거움, 외부 서비스(ex. DB) 비동기 콜백에 약점이 존재 |
| Mocha + Chai | 많은 플러그인, Chai와 시너지 좋음, 속도 빠름 | Mocking 없음, 설정 복잡함. 플러그인이 필요할 수 있음       |
| AVA          | 매우 가벼움, 강력한 비동기 지원, 극한의 속도 | 작은 커뮤니티, Mocking 없음                                |
| Supertest    | HTTP 대상 API 최적                           | Jest, Mocha 등과 함께 사용할 때 좋음.                      |

### Mocking의 유무가 중요한가

1. 외부 의존성 제거는 독립적인 테스트에 유리함.
2. 네트워크 없이 빠른 테스트 진행 가능.
3. 예외 테스트 용이. 외부 요청 결과에 상관없이 에러 유발하여 쉽게 에러를 유발해 볼 수 있음.

### Jest + Supertest 장점

1. Jest의 비동기 테스트 용이성은 과거 보다 개선되었음.
2. Snapshot 테스트 지원 (UI 테스트에 용이) - vue, react 테스트 툴과 일치시키기 좋음. Mocha도 되지만 플러그인 필요.
3. Supertest의 API 요청 다루는 기능이 Jest의 약점을 보완.
4. Jest Mocking + Supertest API call이 결합되면, DB 없이 API 테스트를 수행하는데 효율이 높음.

### Jest + TypeScript 설정

TypeScipt의 부작용을 최소화하기 위해, schema에만 도입 했음에도 테스트를 위해서는 추가적으로 수 많은 설정과
전면적인 코드 수정 그리고 많은 추가 라이브러리가 필요함. 아래 참조.

#### package.json

```
"type": "module", // ESM 방식 사용.
"scripts": {
  "build": "npx tsc",
  "start": "node dist/server.js",
  "dev": "npx tsx src/server.js",
  "test": "node --experimental-vm-modules ./node_modules/jest/bin/jest.js", // 추천.
  "test2": "cross-env NODE_OPTIONS='--experimental-vm-modules' jest", // 비추천. window 사용자의 경우, 아래 cross-env를 설치하면 이렇게.
  "test:s": "node --experimental-vm-modules ./node_modules/jest/bin/jest.js --runInBand" // 테스트간 순차적 실행 원할 때
},
"devDependencies": {
  // 느슨한 TypeScript를 쓴다 해도, TypeScript가 끼어든 순간 Jest의 type추론을 위해 아래 라이브러리들 모두 필요.
  "@types/jest": "^29.5.14",
  "@types/node": "^22.13.1",
  "@types/supertest": "^6.0.2",
  "cross-env": "^7.0.3", // 추가 라이브러리까지 설치해서 esm의 jest 경로를 읽으려면 설치.
  "jest": "^29.7.0",
  "supertest": "^7.0.0",
  "ts-jest": "^29.2.5",
  "ts-node": "^10.9.2",
  "typescript": "^5.7.3"
}
```

--experimental-vm-modules : ESM 활성화 옵션
--runInBan : 테스트를 하나의 프로세스에서 순차적으로 실행(없으면 병렬로 실행). 인스턴스 충돌이 우료될 때 사용.

#### tsconfig.json

```
{
  "compilerOptions": {
    "target": "ESNext", // 최신 JavaScript(ESNext) 지원
    "module": "NodeNext", // Node.js ESM 지원
    "moduleResolution": "NodeNext", // Node.js의 ESM 방식으로 해석
    "strict": true, // 타입 검사 활성화
    "noImplicitAny": false, // any 허용. server.js에서 타입 사용 안했음. 스키마에만 적용할 예정.
    "esModuleInterop": true, // CommonJS 모듈과 호환 가능
    "skipLibCheck": true, // `node_modules` 타입 검사 생략
    "forceConsistentCasingInFileNames": true, // 파일 대소문자 일관성 유지
    "outDir": "./dist", // 컴파일된 JS 파일 저장 위치
    "rootDir": "./src", // `src/` 폴더를 기준으로 빌드 🎯중요 - 현재 프로젝트는 src 아래로 엮었음.
    "resolveJsonModule": true, // JSON 파일 import 가능
    "allowJs": true, // 기존 JS 파일도 TypeScript 환경에서 허용
    "checkJs": false, // JS 파일에서 타입 오류 검사 비활성화
    "isolatedModules": true // Jest ESM 실행을 위해 필요
  },
  "include": ["src"],
  "exclude": ["node_modules", "tests"]
}


```

#### jest.config.js

jest.config.ts로 하는 경우 추가적인 설정오류 보고되었음. 환경설정은 그냥 js로 하여도 작동하는데 무방하므로 js로 추천.

```
export default {
  testEnvironment: "node",
  preset: "ts-jest",
  testMatch: ["**/tests/**/*.test.ts"], // 테스트파일 자체는 ts 유지, 스키마 정의하려면 어차피.
  verbose: true, // 로그 상세히 보기
  clearMocks: true, // 테스트 전 Mock 자동 클리어
  extensionsToTreatAsEsm: [".ts"], // TypeScript 파일을 ESM으로 처리
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // Jest가 ESM 경로를 올바르게 인식하도록 설정
  },
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }], // Jest가 ESM을 올바르게 처리하도록 설정
  },
};

```

#### ./src/server.d.ts

TypeScript가 server.js의 타입을 알 수 있도록 Fastify를 타입 선언해줄 필요.

```
import { FastifyInstance } from "fastify";

declare const fastify: FastifyInstance;
export declare function setupServer(): Promise<FastifyInstance>;

export default fastify;
```

#### server.js

```
export async function setupServer() {} // 테스트 파일에서 인스턴스 초기화 전 실행 값을 분리하여 내보냈음.
```

#### server.test.ts 예시.

```
npm test
// or
npm run test:s
```

## Kubernetes - Minikube

Kubernetes - Fastify Node App과 Database들을 Docker 컨테이너로 만들고 배포 관리.

1. 인스턴스 확장
2. 로드밸런싱과 서비스 디스커버리 - Kubernetes 내부 DNS(CoreDNS)가 재기동 상황에 안정적으로 연결.
3. 자동 재시작
4. 외부 트래픽 제어
5. Continuous Integration/Continuous Deployment 연동 - 새 코드가 빌드된 Docker 컨테이너를 배포 혹은 롤백
6. 모니터링
7. 하이브리드 클라우드 - 온프레미스와 클라우드 환경의 통합 운영이 편리해짐.

Minikube - 실제 Kubernetes 운영환경과 매우 유사한 로컬환경 테스트가 가능.

### 관련 작업순서 (Windows 기준)

1-1. 로컬피시에 도커 실행 환경을 만든다.  
1-2. [x] 도커 네트워크, 도커 컴포우즈 방식.  
2. [o] MiniKube와 Kubernetes를 이용해 로컬에서 자동재실행, CI/CD 파이프라인, 로드 밸런싱 등을 설정하여 테스트.

#### 1-1. Windows - Docker Desktop 환경구축.

- DockerOriginal.md 참조. (Kubernetes를 사용할 경우, Docker 환경만 참조)

#### 1-2. [x] 도커 네트워크를 통한 컨테이너 연동 방식/Docker Compose 방식.

- DockerNetwork.md 참조.

#### 2. [o] Minikube 설치 및 실행

- DockerKubernetes.md 참조.

## 설치된 라이브러리

### .env 읽기.

npm install dotenv

### swagger 자동생성

npm install @fastify/swagger @fastify/swagger-ui

### TypeScript

npm install --save-dev typescript @types/node
npm install --save-dev tsx

1. tsx - TypeScript를 컴파일 없이 직접 실행. 글로벌 설치는 싫기 때문에 명령어 npx tsx src/servr.js로 해야함.

### Jest, Supertest

npm install --save-dev jest supertest ts-jest ts-node @types/jest @types/supertest
npm install cross-env --save-dev

1. ts-jest 용도 - TypeScript에서 Jest를 실행 할 수 있도록 설정
2. ts-node - TypeScript 파일을 직접 실행 할 수 있도록 함.
3. cross-env - (필수 아님) Window에서 Jest의 TypeScript 적용시 ESM 환경에서도 Jest 실행이 안되는 문제 해결을 위해서 필요.

### ajv-i18n

밸리데이터 다국어 적용을 위해 설치함.

```
npm i ajv-i18n
```

## Git 관련 명령어

```
git rm -r --cached dist/ # 실수로 올라간 폴더(dist) 추적 대상에서 제거. 파일은 남음.
git commit -m "Remove dist"
git push origin main  # 다시 푸시해줌

```
