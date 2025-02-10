export default {
  testEnvironment: "node",
  preset: "ts-jest",
  testMatch: ["**/tests/**/*.test.ts"], // 테스트파일 자체는 ts 유지, 스키마 정의하려면 어차피.
  verbose: true, // 로그 상세히 보기
  clearMocks: true, // 테스트 전 Mock 자동 클리어
  extensionsToTreatAsEsm: [".ts"], // TypeScript 파일을 ESM으로 처리
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // Jest가 ESM 경로를 올바르게 인식하도록 설정
  },
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }], // Jest가 ESM을 올바르게 처리하도록 설정
  },
};
