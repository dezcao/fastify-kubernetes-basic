import fp from "fastify-plugin";
import Ajv from "ajv";

async function registerCustomValidators(fastify) {
  const ajv = new Ajv({
    strict: false,
    removeAdditional: false,
    allErrors: true,
  });

  ajv.addKeyword({
    keyword: "nameCheck",
    type: "string",
    errors: true, // 사용자 정의 에러 메시지 설정 활성화
    validate: function (schema, data) {
      if (schema !== true) return true; // 스키마에서, nameCheck: true일 때만 실행
      console.log("Validation nameCheck 실행됨 - 입력된 데이터:", data);

      if (!/^[a-zA-Z]+$/.test(data)) {
        return false; // 검증 실패 시 false 반환
      }

      return true; // 검증 통과 시 true 반환
    },
    metaSchema: { type: "boolean" },
    error: {
      // 특별한 일 없으면, 이것도 쓰지 말자. 그냥 기본 기능에 다국어면 대부분 가능하다.
      message: "", // 속성이 아예, 없으면 에러남.
      params: {
        devMessage: "나만의 메시지가 보내고 싶을때", // 특별한 일 없으면 이렇게 하지 말자.
        errorCode: "E0005", // 나만의 오류코드 보내고 싶을때 (errors/errorHandler.js 참조)
      },
    },
  });

  fastify.setValidatorCompiler(({ schema }) => ajv.compile(schema));
}

export default fp(registerCustomValidators);
