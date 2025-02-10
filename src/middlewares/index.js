const corsMiddleware = await import(`./cors.js`);
const helmetMiddleware = await import(`./helmet.js`);

export default async function registerMiddlewares(fastify) {
  await fastify.register(corsMiddleware.default);
  await fastify.register(helmetMiddleware.default);
}
