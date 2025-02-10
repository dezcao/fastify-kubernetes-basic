import Redis from "ioredis";

export default async function initRedis(fastify) {
  const maxRetries = process.env.REDIS_MAX_RETRIES || 5; // 최대 재시도 횟수
  let retryCount = 1; // 재시도 횟수 추적

  console.log("Redis 초기화.");
  const redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: process.env.REDIS_DB || 0,
    retryStrategy: (times) => {
      if (retryCount >= maxRetries) {
        console.error("Redis 최대 재시도 횟수를 초과하여 연결을 중단합니다.");
        return null; // ioredis에게 null을 줌.
      }
      retryCount++;
      return Math.min(
        times * (process.env.REDIS_RETRY_MULTIPLIER || 50),
        process.env.REDIS_RETRY_MAX || 2000
      );
    },
  });

  redis.on("connect", () => {
    console.log("Redis 연결 성공!");
  });

  redis.on("error", (err) => {
    console.error("Redis 연결 오류:", err);
    if (retryCount >= maxRetries) {
      console.error("Redis 재연결 실패.");
    }
  });

  // Fastify 전역에서 `fastify.redis`로 사용 가능하게 등록
  fastify.decorate("redis", redis);
}
