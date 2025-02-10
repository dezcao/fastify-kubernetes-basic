import { FastifySchema } from "fastify";

export const helloQueryStringSchema = {
  type: "object",
  properties: {
    name: { type: "string", pattern: "^[a-zA-Z]+$", minLength: 2 },
  },
  required: ["name"],
} as const;

export const helloResponseSchema = {
  200: {
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
} as const;

export const helloSchema: FastifySchema = {
  querystring: helloQueryStringSchema,
  response: helloResponseSchema,
};
