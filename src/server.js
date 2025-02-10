import Fastify from "fastify";
import registerMiddlewares from "./middlewares/index.js";
import errorHandler from "./errors/errorHandler.js";
import registerRoutes from "./routes/index.js";
import swaggerPlugIn from "./routes/swagger.js";
import initDatabase from "./databases/index.js";
import initRedis from "./databases/redis.js";
import initMongo from "./databases/mongo.js";
import registerCustomValidators from "./validations/customValidators.js";

import dotenv from "dotenv";

dotenv.config(); // 환경변수 로드.

const fastify = Fastify({
  logger: true,
  http2: false, // HTTP2 활성화 기능
  serializer: (payload) => JSON.stringify(payload, (_, value) => (typeof value === "bigint" ? value.toString() : value)),
});

// Fastify 인스턴스 내보내기. (테스트 및 인스턴스 지원)
export default fastify;

export async function setupServer() {
  await registerMiddlewares(fastify);
  await errorHandler(fastify);
  await fastify.register(registerCustomValidators);

  swaggerPlugIn(fastify, "/swagger"); // Swagger 등록 (라우트보다 먼저)

  await registerRoutes(fastify);
  await initRedis(fastify);
  // await initMongo(fastify);
  await initDatabase(fastify); // DB 연결

  return fastify;
}

const host = (process.env.HOST || "0.0.0.0").trim();
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  (async () => {
    try {
      const server = await setupServer();
      const address = await server.listen({
        port,
        host,
      });
      console.log(`🚀 Fastify 서버가 ${address}에서 실행 중!`);
    } catch (err) {
      console.error("Fastify 서버 실행 중 오류 발생:", err);
      process.exit(1);
    }
  })();
}
