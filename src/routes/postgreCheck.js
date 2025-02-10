export default async function postgresRoutes(fastify) {
  // 1. test_users 테이블에서 데이터 조회 (PostgreSQL)
  fastify.get("/pg-users", async (req, reply) => {
    try {
      const { rows } = await req.db.query("SELECT * FROM test_users"); // 전체 데이터 조회
      return { success: true, data: rows };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  // 2. test_users 테이블에 새 사용자 추가 - GET 방식 (브라우저 테스트용)
  fastify.get("/pg-add-user", async (req, reply) => {
    // ex. /pg-add-user?name=John&email=john@example.com
    const { name, email } = req.query;

    if (!name || !email) {
      return { success: false, message: "name과 email을 입력해주세요!" };
    }

    try {
      const result = await req.db.query(
        "INSERT INTO test_users (name, email) VALUES ($1, $2) RETURNING id",
        [name, email]
      );
      return {
        success: true,
        message: "새 사용자 추가됨!",
        insertId: result.rows[0].id, // PostgreSQL에서는 `RETURNING id`로 값 반환
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  // 3. POST /pg-test-users - 데이터를 삽입 (REST)
  fastify.post("/pg-test-users", async (req, reply) => {
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        return reply
          .status(400)
          .send({ success: false, message: "name과 email은 필수입니다." });
      }
      const result = await req.db.query(
        "INSERT INTO test_users (name, email) VALUES ($1, $2) RETURNING id",
        [name, email]
      );
      return {
        success: true,
        message: "데이터가 추가되었습니다.",
        id: result.rows[0].id,
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  // 4. test_users 테이블에서 특정 사용자 삭제 (PostgreSQL)
  fastify.delete("/pg-delete-user/:id", async (req, reply) => {
    const { id } = req.params;
    try {
      const result = await req.db.query(
        "DELETE FROM test_users WHERE id = $1",
        [id]
      );
      return { success: true, message: `ID ${id} 사용자 삭제 완료`, result };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  // 5. PostgreSQL 헬스 체크 API
  fastify.get("/pg-health", async (req, reply) => {
    try {
      const { rows } = await req.db.query("SELECT NOW() as server_time");
      return {
        success: true,
        message: "PostgreSQL 정상 작동 중!",
        data: rows[0],
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });
}
