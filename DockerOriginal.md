## Fastify + Docker + WSL 실행 가이드

이 문서는 **Fastify를 Docker 컨테이너로 실행하는 방법**을 단계별로 설명합니다.  
로컬 개발 환경에서 Docker를 활용하여 Fastify 애플리케이션을 실행하는 방법을 공부하면서 정리했습니다.

1. 로컬피시에 도커 실행 환경을 만든다.
2. 현재까지 만든 Fastify를 도커 컨테이너로 만든다. - 연습용. Kubernetes 설정은 조금 다르므로 그 이하는 안쓸것 입니다.

### 1. Windows - Docker Desktop 환경구축.

window 환경에서 Docker를 실행하기 위해서 **wsl**이 필요함.  
wsl 버전 확인 및 설치 (아래와 같이, 그냥 install하는 경우 ubuntu 설치됨)

```
 wsl -l -v // 버전 확인.
 wsl --install // 설치 ubuntu
```

컴퓨터 재부팅 후, wsl2 ubuntu를 실행시켜 최신화 수행.  
최초 실행하면, account와 password를 입력해야 함.

```
wsl
```

wsl2 터미널에 진입하였다면, 아래와 같이 최신화.

```
sudo apt update && sudo apt upgrade -y
```

wsl2 터미널에서 빠져나옴.

```
exit
```

https://www.docker.com/ 에서 Docker Desktop 설치파일 다운로드. 설치 후 재부팅.

계정 로그인, 그럼 이세계 포털이 열림.  
두려우면 아래 음악을 듣는다.  
https://www.youtube.com/watch?v=WyrZYGmoaFM&list=RDMM&index=2

### 2. [x] 본 Fastify App을 Docekr 컨테이너로 만듬.

1. 프로젝트 루트에 Dockerfile 생성(프로젝트 내, 파일 참조)
2. .dockerignore 추가

3. 도커 이미지를 빌드. (최초 빌드는 할게 많아서 시간이 조금 더 걸림)

```
docker build -t fastify-node-v1 .
```

> -t : 도커 이미지에 태그네임 설정  
> . : 현재 디렉토리에 있는 Dockerfile 사용

4. 도커 실행 (docker.desktop의 images 메뉴에서 해도 됨.)

다른 도커 컨테이너와 서로 연결할 것이므로 네트워크가 필요.

```
docker run -d -p 3000:3000 --name fastify --env-file .env fastify-node-v1
```

> -d : 백그라운드 실행  
> -p 3000:3000 : 호스트(로컬)과 컨테이너 포트를 각 3000으로 연결  
> -name : 컨테이너 이름 지정  
> --env-file .env : .env 파일의 환경 변수 적용

5. 컨테이너 실행중 확인

```
docker ps -a
```

6. 컨테이너 실행 로그 확인

```
docker logs fastify
```

7. 컨테이너 중단, 삭제

```
docker stop fastify
docker rm fastify
```

8. 도커 이미지 관련 명렁

```
docker images
docker rmi 지우고싶은도커이미지이름
```

9. [요약] 소스를 수정하고, 재빌드업 하려면 다음을 반복 수행하면 됨.

```
docker build -t fastify-node-v1 .
docker run -d -p 3000:3000 --name fastify --env-file .env fastify-node-v1
docker logs fastify
docker stop fastify
docker rm fastify
```

6. 브라우저에서 http://localhost:3000 확인
