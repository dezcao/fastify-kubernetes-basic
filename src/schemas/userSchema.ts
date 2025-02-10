import { FastifySchema } from "fastify";

export interface UserQuery {
  name: string;
}

export interface UserBody {
  username: string;
  password: string;
}

const userQueryStringSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      nameCheck: true, // 커스텀 밸리데이터 추가 검증
    },
  },
  required: ["name"],
} as const;

const userBodySchema = {
  type: "object",
  properties: {
    username: { type: "string", minLength: 2, maxLength: 10, nameCheck: true },
    password: { type: "string" },
  },
  required: ["username", "password"],
} as const;

const responseSchema = {
  200: {
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
};

export const userGetSchema: FastifySchema = {
  querystring: userQueryStringSchema,
  response: responseSchema,
};

export const userPostSchema: FastifySchema = {
  body: userBodySchema,
  response: responseSchema,
};
