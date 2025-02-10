import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { userGetSchema, userPostSchema, UserBody, UserQuery } from "../schemas/userSchema.js"; // ESM 환경에서는 실제 파일확장자가 ts라도 js로 확장자 유지.
import { getUserService, postUserService } from "../services/userService.js";
import { withTransaction } from "../services/transactionWrapper.js";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/user",
    {
      schema: userGetSchema,
      // attachValidation: true, // 기본 밸리데이션에 대해 후작업용.
      // validatorCompiler: ({ schema, method, url, httpPart }) => {
      // 완전히 혼자 할 때,
      //   return (data) => {
      //     console.log(data);
      //     return false;
      //   };
      // },
    },
    async (request: FastifyRequest<{ Querystring: UserQuery }>, reply: FastifyReply) => {
      const user1 = await getUserService(request.query.name);
      return { message: `Hello, ${request.query.name}` };
    }
  );

  fastify.post(
    "/user",
    {
      schema: userPostSchema,
    }, // 스키마 적용
    async (request: FastifyRequest<{ Body: UserBody }>, reply: FastifyReply) => {
      const result = await withTransaction(request, async () => {
        const user1 = await postUserService(request);
        const user2 = await postUserService(request);
        const user3 = await postUserService(request);
        const user4 = await postUserService(request);
        return { message: `Hello, ${user1}` };
      });

      return { message: `result - ${result}` };
    }
  );

  // END
}
