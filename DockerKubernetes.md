## Overview

- Minikube 설치 및 기본 설정
- 각 서비스 Kubernetes Deployment 및 Service 설정
  1. Fastify → Deployment + Service
  2. Redis → Deployment + Service
  3. MariaDB → StatefulSet + Service
  4. PostgreSQL → StatefulSet + Service
  5. MongoDB → Deployment + Service
- 서비스 간 네트워크 연동
- 자동 재시작, 로드 밸런싱, CI/CD 가능

| Kubernetes 관련 용어 | 설명                                                                                                  | 언제 사용해야 하는가?                                |
| -------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Pod                  | 컨테이너                                                                                              | Fastify, Redis 같은 애플리케이션 실행                |
| Deployment           | Pod의 배포, 업데이트, 롤백 자동 관리 객체. replicas: 2 이면, Pod를 두 개 만들어 관리                  | Stateless 애플리케이션 (Fastify, Redis 등)           |
| Service              | 네트워크 객체. Pod들 간 통신 제공(Pod들은 IP가 동적으로 변하므로). selector: app: redis               | Pod의 IP가 변경되므로 고정된 주소를 제공             |
| StatefulSet          | 상태가 유지되는 애플리케이션. Pod에 고유 ID 부여됨. 동일한 볼륨을 유지하면서 재시작됨                 | DB 같은 상태 유지 애플리케이션 (MariaDB, PostgreSQL) |
| ConfigMap            | 환경 변수 저장                                                                                        | 일반적인 환경 변수 (예: Fastify의 `.env`)            |
| Secrets              | 민감정보 저장. Base64로 인코딩.                                                                       | 비밀번호, API 키 저장                                |
| Ingress              | 도메인 및 트래픽 관리. 외부에서 Kubernetes 내부 서비스에 접근 관리. (http://api.sample.com → Fastify) | 외부에서 Fastify로 접속할 때                         |
| NodePort             | 외부 접근 가능 기능                                                                                   | 외부에서 Minikube 내부 서비스에 접근                 |

## Kubernetes 테스팅 준비.

### Chocolatey 설치

Windows에서 apt나 yum 같은 패키지 매니저 역할을 해줌.

- Windows에서, PowerShell 관리자 권한으로 실행.

```
Set-ExecutionPolicy Bypass -Scope Process -Force; `
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; `
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

- 실행 후, 경고 (아래, choco 실행에 문제는 없음.)
  1. "WARNING: It's very likely you will need to close and reopen your shell"  
     ➡ PowerShell을 다시 실행해야 Choco가 정상 동작할 수 있음!
  2. "Not setting tab completion: Profile file does not exist at ..."  
     ➡ 자동 완성 기능(Tab 키) 설정 파일이 없어서 적용하지 않았다.

### Minikube 설치

이번에도 관리자 권한이 필요하기 때문에, PowerShell을 관리자 권한으로 실행하여 다음 명령을 수행.

```
choco install minikube -y
```

### Minikube 실행

- 실행

```
minikube start
```

- 실행 확인

```
kubectl get nodes
```

- 대시보드 실행 : 브라우저가 열림.

```
minikube dashboard
```

- 상태 체크

```
minikube status
```

- 구성 확인

```
kubectl get all -A
```

- 기타

```
minikube stop
minikube delete
```

## Fastify + Redis + DB(Maria or Postgre)

### 관련파일 참조 바람.

> fastify-deployment.yaml  
> fastify-service.yaml  
> redis-deployment.yaml  
> redisy-service.yaml
> mariadb-statefulset.yaml  
> mariadb-service.yaml
> postgre-statefulset.yaml  
> postgre-service.yaml  
> deploy-fastify.sh

### Kubernetes 배포 및 실행 확인

- redis

```
kubectl apply -f redis-deployment.yaml
kubectl apply -f redis-service.yaml
```

- mongo  
  // todo.
- mariaDB, postgreSql  
  fastify 내부에서는 .env에 설정한 하나의 DB를 사용하게 되어있음.

```
kubectl apply -f mariadb-statefulset.yaml
kubectl apply -f mariadb-service.yaml

kubectl apply -f postgre-statefulset.yaml
kubectl apply -f postgre-service.yaml
```

- fastify Node API App 배포 + Minikube에서 Fastify를 URL로 확인
  1. 위 접속 가능한 DB를 생성한 경우
  - server.js에서 await initRedis(fastify), await initDatabase(fastify)의 주석을 풀고 아래 명령을 실행하여 컨테이너 생성시킴.
  2. 디비 생성 요청 후, 실행 시간이 걸리므로 확인 명령으로 생성 되었는지 확인.

```
./deploy-fastify.sh
```

- 명령어 예시

```
kubectl get pods
kubectl get services

kubectl logs fastify-deployment-xxxxx
kubectl describe pod mariadb-0
```

> Fastify 앱은, Docker hub 없이 로컬 소스를 기반으로 하고 있어 수정시 빌드 요청이 필요함.  
> fastify-deployment.yaml - imagePullPolicy: Never 참조.  
> 리눅스면 파일 실행 권한 확인 : ls -l deploy-fastify.sh  
> 경고 메시지 : Because you are using a Docker driver on Windows...  
>  ➡ 실행 중인 터미널 닫으면, 동작을 멈출거다.

예. 물리공간 삭제

```
kubectl delete pvc mariadb-pvc
kubectl delete pv mariadb-pv
```

예. 마리아디비 컨테이너

```
kubectl exec -it mariadb-0 -- sh
```

예. 접속 콘솔에서 mariadb 클라이언트 사용

```
mariadb -u testuser -ptestpassword -D testdb
```

테이블 정보 확인

```
DESC test_users;
```

## CI/CD (예정)

## Road Balancing (예정)
