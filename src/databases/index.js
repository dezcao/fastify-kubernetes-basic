import { initMariadb } from "./mariadb.js";
import { initPostgre } from "./postgre.js";
import { initOracle } from "./oracle.js";

export default async function initDatabase(fastify) {
  const dbs = {
    mariadb: initMariadb,
    postgre: initPostgre,
    oracle: initOracle,
  };
  const database = process.env.DATABASE_TYPE; // 기본값 PostgreSQL

  console.log("현재 DATABASE_TYPE:", process.env.DATABASE_TYPE);
  console.log("선택된 database:", database);

  if (!dbs[database]) {
    throw new Error(`Unsupported database: ${database}`);
  }

  const pool = await dbs[database](); // 선택된 DB 초기화 및 풀 연결
  fastify.decorate("dbPool", pool); // 전역 등록 (배치 작업 등에 사용)

  fastify.decorateRequest("db", null); // 어떤 DB의 커넥션인지 Fastify에게 미리 알림
  fastify.addHook("preHandler", async (req, reply) => {
    if (req.method === "OPTIONS" || req.raw.url === "/favicon.ico") {
      return;
    }

    if (!fastify.dbPool) {
      console.log(
        "⚡ 만약, Kubernetes 실행중이 아니라면, server.js에서 initRedis, initDatabase를 주석으로 할것. ⚡"
      );
      return;
    }

    req.db =
      database === "postgre"
        ? await fastify.dbPool.connect()
        : await fastify.dbPool.getConnection();

    // 트랜잭션 기본 함수들을 빈함수로 초기화
    req.db.begin = async () => {};
    req.db.commit = async () => {};
    req.db.rollback = async () => {};

    req.db.begin = async () => {
      if (database === "mariadb") return req.db.beginTransaction();
      if (database === "postgre") return req.db.query("BEGIN");
      if (database === "oracle")
        return req.db.execute("BEGIN", [], { autoCommit: false });
    };

    req.db.commit = async () => {
      if (database === "mariadb") return req.db.commit();
      if (database === "postgre") return req.db.query("COMMIT");
      if (database === "oracle") return req.db.execute("COMMIT");
    };

    req.db.rollback = async () => {
      if (database === "mariadb") return req.db.rollback();
      if (database === "postgre") return req.db.query("ROLLBACK");
      if (database === "oracle") return req.db.execute("ROLLBACK");
    };

    req.db.sqlLoader = async (queryXmlId, params) => {
      console.log(`SQL 실행 요청: ${queryXmlId} | 파라미터:`, params);

      // 현재는 단순 실행 (나중에 XML 기반 SQL 파서 연동 가능)
      const query = `SELECT * FROM some_table WHERE id = $1`; // 임시 쿼리 (나중에 XML 파서로 대체)
      const result = await req.db.query(query, params);

      return result.rows;
    };
  });

  // 응답 전 처리
  fastify.addHook("onSend", async (req, reply, payload) => {
    // 현재는 아무것도 없음. log 데이터??
  });

  console.log(`${database} 데이터베이스 초기화 프로세스 종료.`);
}
