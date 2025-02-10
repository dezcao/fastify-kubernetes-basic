import helmet from "@fastify/helmet";

export default async function helmetMiddleware(fastify) {
  // Helmet 적용
  fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // 기본적으로 자기 도메인에서만 리소스 로드 허용
        scriptSrc: ["'self'", "https://trusted-cdn.com"], // 신뢰할 수 있는 CDN에서만 스크립트 허용
        styleSrc: ["'self'", "'unsafe-inline'"], // 인라인 스타일 허용 (필요 시 조정)
        imgSrc: ["'self'", "data:", "https://images.example.com"], // 이미지 로딩 허용 도메인
        connectSrc: ["'self'", "https://api.example.com"], // API 요청 허용 도메인 (self - 자기자신 및 example - 추가할 api 주소)
      },
    },
    frameguard: { action: "sameorigin" }, // 동일 출처에서만 iframe 허용
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, // HTTPS 강제 적용 (1년)
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }, // 리퍼러 정책 설정
    xssFilter: true, // XSS 필터 활성화
    noSniff: true, // MIME 스니핑 방지
    hidePoweredBy: true, // 'X-Powered-By' 헤더 제거
  });
}
