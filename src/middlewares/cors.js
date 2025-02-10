import cors from "@fastify/cors";

// CORS 설정
export default async function corsMiddleware(fastify) {
  fastify.register(cors, {
    origin: ["https://example.com", "https://anotherdomain.com"], // 특정 도메인만 허용
    methods: ["GET", "POST", "PUT", "DELETE"], // 허용할 HTTP 메서드 지정
    allowedHeaders: ["Content-Type", "Authorization"], // 허용할 헤더 지정
    credentials: true, // 쿠키 전송 허용
    maxAge: 86400, // Preflight 요청 결과를 24시간(86400초) 동안 캐싱
  });
}
