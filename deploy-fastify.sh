#!/bin/bash

echo "Minikube Docker 환경 설정..."
eval $(minikube docker-env)

# 중요!. Minikube가 내부 Dockerfile을 이용하여 빌드 하도록 함.
echo "Fastify Docker 이미지 빌드 중..."
docker build -t fastify-node-v1 .

echo "Fastify Deployment 삭제 (기존 Pod 제거)..."
kubectl delete pod -l app=fastify --ignore-not-found=true

echo "Fastify Deployment 다시 배포..."
kubectl apply -f fastify-deployment.yaml

echo "Fastify Service 다시 배포..."
kubectl apply -f fastify-service.yaml

echo "Fastify 실행 상태 확인..."
kubectl get pods -l app=fastify

echo "Fastify 서비스 URL 확인:"
minikube service fastify-service --url
