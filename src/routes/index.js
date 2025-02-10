import helloRoutes from "./hello.js";
import userRoutes from "./user.js";
import redisCheck from "./redisCheck.js";
import mogoCheck from "./mogoCheck.js";
import mariadbCheck from "./mariadbCheck.js";
import postgreCheck from "./postgreCheck.js";

export default async function registerRoutes(fastify) {
  await fastify.register(helloRoutes);
  await fastify.register(userRoutes);
  await fastify.register(redisCheck);
  await fastify.register(mogoCheck);
  await fastify.register(mariadbCheck);
  await fastify.register(postgreCheck);

  fastify.get("/", async function handler(request, reply) {
    return { message: "hello world!" };
  });

  fastify.get("/ping", async function handler(request, reply) {
    return { message: "pong" };
  });
}
