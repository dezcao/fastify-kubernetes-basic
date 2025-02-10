import { MongoClient } from "mongodb";

export default async function initMongo(fastify) {
  const user = process.env.MONGO_USER;
  const password = process.env.MONGO_PASSWORD;
  const dbName = process.env.MONGO_DB_NAME;
  let uri = process.env.MONGO_URI;

  if (!uri || !dbName) {
    console.error(
      "MongoDB 설정 오류: .env 파일에서 MONGO_URI 및 MONGO_DB_NAME을 확인하세요."
    );
    return;
  }

  // 인증 정보가 있는 경우, URI에 추가
  if (user && password) {
    const auth = `${user}:${password}@`;
    uri = uri.replace("mongodb://", `mongodb://${auth}`);
  }

  try {
    console.log(`MongoDB 초기화.`);
    const client = new MongoClient(uri, {
      connectTimeoutMS: process.env.MONGO_CONNECT_TIMEOUT || 5000, // 연결 최대 대기시간 (기본 5초)
      socketTimeoutMS: process.env.MONGO_SOCKET_TIMEOUT || 10000, // 응답 대기시간 (기본 10초)
      serverSelectionTimeoutMS:
        process.env.MONGO_SERVER_SELECTION_TIMEOUT || 5000, // 서버 선택 제한시간 (기본 5초)
    });

    await client.connect();
    console.log(`MongoDB 연결 성공! (DB: ${dbName})`);

    fastify.decorate("mongo", {
      client,
      db: client.db(dbName),
    });
  } catch (err) {
    console.warn("MongoDB 연결 실패:", err.message);
  }
}
