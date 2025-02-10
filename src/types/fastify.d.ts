import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    myProperty?: boolean; // fastify에 개별 속성을 추가하고 싶으면, ex. typeof fastify.myProperty === 'boolean'
  }
}
