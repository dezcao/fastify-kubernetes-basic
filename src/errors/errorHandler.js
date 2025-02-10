import ajvLocalize from "ajv-i18n";

export default function errorHandler(fastify) {
  const schemaValidationTypes = {
    E0000: "Unknown Error",
    E0005: "이름은 영문이어야 합니다.",
  };

  fastify.setErrorHandler((error, request, reply) => {
    const errorResponse = {
      url: request.url, // 에러 발생한 요청의 URL
      method: request.method, // 요청 메서드 (GET, POST 등)
      error: schemaValidationTypes.E0000,
    };

    // 스키마 에러 핸들링
    if (error.validation) {
      // const userLang = request.headers["accept-language"] || "ko";
      ajvLocalize.ko(error.validation); // 🇰🇷 기본 한국어

      // 첫번째 오류에 대해서만 응답하겠음. 복합적으로 오류가 있더라도 사용자는 가장 우선된 조건부터 하나씩만 집중.
      const { keyword, message, params } = error.validation[0];
      console.log({ keyword, message, params });

      if (params?.errorCode && schemaValidationTypes[params.errorCode]) {
        errorResponse.error = schemaValidationTypes[params.errorCode];
      } else if (params?.devMessage) {
        errorResponse.error = params.devMessage;
      } else if (message) {
        errorResponse.error = message;
      }

      return reply.status(400).send({ error: errorResponse });
    }

    // 서버 내부 오류 (500 Internal Server Error) 처리
    if (!error.statusCode || error.statusCode >= 500) {
      console.error("[Server Error]", error);

      return reply.status(500).send({
        error: "Internal Server Error",
        message: error.message || "Something went wrong on the server.",
      });
    }

    // 기타 오류는 기본 처리
    reply.send(error);
  });
}
