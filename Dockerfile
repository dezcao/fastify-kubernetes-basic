# Node.js 로컬 버전 확인하여, 끝자리 버전까지 맞추는게 가장 안전. 
# alpine - 도커 컨테이너 내부 리눅스 환경으로써, Node.js가 더 최적화 경령화된 버전.
FROM node:22.13.1-alpine

# 컨테이너 내부 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json을 복사한 후, 설치 (node_modules만 생김)
COPY package*.json ./
RUN npm install

# 모든 개발 소스 코드 복사 : .dockerignore에 제거할 파일 추가 할 것.
COPY . .

# TypeScript 때문에 빌드 실행이 필요함.
RUN npm run build

# Fastify 앱 실행 (3000번 포트 사용) - 타입스크립트 빌드된 폴더 안에서 실행
EXPOSE 3000
CMD ["node", "dist/server.js"]
