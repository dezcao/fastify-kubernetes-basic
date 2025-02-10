export default async function redisCheck(fastify) {
  fastify.get("/cache", async (req, reply) => {
    //ex. /cache?key=name
    const { key } = req.query;
    const cachedValue = await fastify.redis.get(key);
    return { data: cachedValue || "캐시된 데이터 없음" };
  });

  fastify.get("/redis-set", async (req, reply) => {
    //ex. /redis-set?key=name&value=jaepil
    const { key, value } = req.query;
    await fastify.redis.set(key, value, "EX", 60 * 5); // 데이터 생존시간 5분 TTL(Time To Live) 설정
    return { message: "캐시에 저장됨!" };
  });

  // fastify.post("/cache", async (req, reply) => {
  //   const { key, value } = req.body;
  //   await fastify.redis.set(key, value, "EX", 60); // 60초 TTL 설정
  //   return { message: "캐시에 저장됨!" };
  // });

  fastify.delete("/cache/:key", async (req, reply) => {
    await fastify.redis.del(req.params.key);
    return { message: "캐시 삭제 완료!" };
  });

  fastify.get("/redis-test", async (request, reply) => {
    try {
      await fastify.redis.set("testKey", "Hello from Fastify!");
      const value = await fastify.redis.get("testKey");
      return { success: true, value };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });
}
