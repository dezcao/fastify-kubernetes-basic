import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export default function swaggerPlugIn(fastify, routePrefix) {
  fastify.register(fastifySwagger, {
    swagger: {
      info: {
        title: "My API",
        description: "API documentation",
        version: "1.0.0",
      },
    },
  });

  // Swagger UI 웹 인터페이스
  fastify.register(fastifySwaggerUi, {
    routePrefix,
    staticCSP: true,
    exposeRoute: true,
  });
}
