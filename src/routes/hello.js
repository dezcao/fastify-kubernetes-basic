import { helloSchema } from "../schemas/helloSchema.js"; // ESM 환경에서는 js로 확장자 유지.

export default async function helloRoutes(fastify) {
  fastify.get(
    "/hello",
    {
      schema: helloSchema,
    },
    async (request, reply) => {
      return { message: `Hello, ${request.query.name}` };
    }
  );
}
