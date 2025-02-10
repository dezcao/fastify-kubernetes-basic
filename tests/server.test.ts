import { setupServer } from "../src/server.js";
import request from "supertest";
import { FastifyInstance } from "fastify";

let app: FastifyInstance;

beforeAll(async () => {
  app = await setupServer(); // Jest 실행 전에 Fastify 서버 초기화
  await app.ready(); // 서버가 준비될 때까지 대기 (listen 불필요)
});

afterAll(async () => {
  await app.close(); // 테스트가 끝나면 Fastify 서버 종료
});

describe("Fastify Server", () => {
  it("GET /ping should return { message: 'pong' }", async () => {
    const response = await request(app.server).get("/ping"); // Fastify의 `server` 속성 사용
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "pong" });
  });
});
