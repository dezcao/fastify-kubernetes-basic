## Docker 네트워크 vs Docker Compose 비교

| 방식                                      | 장점                              | 단점                                     |
| ----------------------------------------- | --------------------------------- | ---------------------------------------- |
| **수동 네트워크** (`docker network`)      | 네트워크 설정을 직접 관리 가능    | 컨테이너 개수가 많아지면 관리가 어려움   |
| **Docker Compose** (`docker-compose.yml`) | 여러 컨테이너를 한 번에 실행 가능 | `docker-compose` 설정 파일을 작성해야 함 |

Kubernetes 환경에서는 수동 네트워크 방식보다 **Kubernetes의 Service 기능을 활용**하는 것이 일반적.

### 1. 수동으로 각기 다른 Docker 컨테이너간의 연동

1. 네트워크 생성

```
docker network create dezca-net
```

2. redis 공식 컨테이너 생성.  
   이번에는 redis 에게 커넥터가 패스워드를 가져오도록 추가 보안 설정. .evn 참조.(실무에서 노출 금지.)  
   cache 용도로 쓸 예정으로 volume 설정 안함.
   container 이름을 redis로 하였음.(컴포우즈 방식일 때를 고려.)

```
docker run --name redis --network dezca-net -d redis redis-server --requirepass your_redis_password
```

3. fastify 이미지 굽고, 컨테이너 실행

```
docker build -t fastify-node-v1 .
docker run -d -p 3000:3000 --name fastify --network dezca-net --env-file .env fastify-node-v1
```

4. 실행로그 보기

```
docker logs fastify
```

5. fastify 컨테이너 내부에서 redis 컨테이너 체크

```
docker exec -it fastify sh
ping -c 5 redis
```

> i : 인터렉티브 모드. 상호작용 가능  
> t : 가상 터미널 활성화.  
> sh : 도커 내부 터니널에 진입후 사용할 쉘 (Bourne shell - 도커 기본쉘)  
> c 5 : 5번 실행 후 종료  
> Ctrl + C : 핑 중간에 수동 종료하고 싶으면.  
> exit : 컨테이너 터미널에서 빠져나감.

> [요약]  
> dezca-net을 생성.  
> redis 컨테이너 생성 및 dezca-net에 등록.  
> fastify App의 redis를 호출 로직이 redis 컨테이너를 알 수 있도록, .env 파일에 HOST를 REDIS_HOST=redis 설정.
> fastify로 container 생성.

> [실행명령] 컨테이너 중지 및 삭제

```
docker stop fastify
docker stop redis
docker rm fastify
docker rm redis
```

a.네트워크 확인 및 상제정보 보기

```
docker network ls
docker network inspect dezca-net
```

b.네트워크에서 특정 컨테이너 제거

```
docker network disconnect dezca-net fastify
docker network disconnect dezca-net redis
```

c.네트워크에서 모든 컨테이너 제거

```
docker network disconnect -f dezca-net $(docker network inspect -f '{{range .Containers}}{{.Name}} {{end}}' dezca-net)
```

d.네트워크 삭제

```
docker network rm dezca-net
```

### 2. Docker Compose 방식

한꺼번에 여러 컨테이너 실행

#### docker-compose.yml

```
# docker-compose.yml
services:
  redis:
    image: redis
    container_name: redis
    restart: always
    ports:
      - "6379:6379"
    command: ["redis-server", "--requirepass", "your_redis_password"]

  fastify:
    build: .
    image: fastify-node-v1
    container_name: fastify
    restart: always
    ports:
      - "3000:3000"
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_PASSWORD=your_redis_password
    depends_on:
      - redis
```

> 주의: 컴포우즈 방식일때는 컴포즈 내, 서비스 명칭을 host로 하여야 함(REDIS_HOST=redis).  
> 수동 docker network에선 container이름을 host로 하여야 함. (두 이름 일치시키겠음.)

#### 컴포우즈 실행시키기. Redis가 없으면 알아서 설치하면서 올라감.

```
docker-compose up -d --build --pull always
```

> - -d : 백그라운드에서 실행
> - --build : 지정한 경로의 Dockerfile을 이용하여 빌드를 수행하라.(fastify 빌드해서 컴포넌트 올리도록)
> - --pull always : redis와 같이, 자동 설치되는 경우 항상 최신 버전으로 수행하라.

> [요약]
>
> - 컴포우즈 방식에선, 도커 데스크탑에 하나의 그룹 안에 컨테이너 두 개가 있는것 처럼 보여짐.
> - docker ps를 보면 컨테이너는 두개임.
> - docker network ls 확인: fastify-node_default로 네트워크 생김. (fastify-node는 package.json에 등록된 이름.)

#### 컴포우즈 전체 컨테이너 + 네트워크 삭제

```
docker-compose down
```

#### 볼륨이 있는경우 삭제하면서 중지

```
docker-compose down -v
```

#### 프로젝트의 redis 테스트 : /routes/redisCheck.js

브라우저로 확인

```
http://localhost:3000/cache?key=name
http://localhost:3000/redis-set?key=name&value=jaepil
http://localhost:3000/cache?key=name
```

Redis 컨테이너 콘솔에 접속하여 테스트

```
docker exec -it redis redis-cli
set name "jaepil"
get name
```

Redis는 캐시용인 경우가 많아서, Docker Volume 설정 안함.
