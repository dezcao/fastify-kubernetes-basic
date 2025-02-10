import { FastifyInstance } from "fastify";

declare const fastify: FastifyInstance;
export declare function setupServer(): Promise<FastifyInstance>;

export default fastify;
