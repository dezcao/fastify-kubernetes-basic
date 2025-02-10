export default async function mariadbRoutes(fastify) {
  // 1. test_users 테이블에서 데이터 조회
  fastify.get("/users", async (req, reply) => {
    try {
      const rows = await req.db.query("SELECT * FROM test_users"); // 전체 데이터 조회
      return { success: true, data: rows };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  // 2. test_users 테이블에 새 사용자 추가 - 브라우저로 확인하고자 get으로 구성함.
  fastify.get("/add-user", async (req, reply) => {
    // ex. /add-user?name=John&email=john@example.com
    const { name, email } = req.query;

    if (!name || !email) {
      return { success: false, message: "name과 email을 입력해주세요!" };
    }

    try {
      const result = await req.db.query(
        "INSERT INTO test_users (name, email) VALUES (?, ?)",
        [name, email]
      );
      return {
        success: true,
        message: "새 사용자 추가됨!",
        insertId: result.insertId ? String(result.insertId) : null, // BigInt 방지
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  // POST /test-users - 데이터를 삽입 - REST
  fastify.post("/test-users", async (req, reply) => {
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        return reply
          .status(400)
          .send({ success: false, message: "name과 email은 필수입니다." });
      }
      const result = await req.db.query(
        "INSERT INTO test_users (name, email) VALUES (?, ?)",
        [name, email]
      );
      return {
        success: true,
        message: "데이터가 추가되었습니다.",
        id: result.insertId,
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  // test_users 테이블에서 특정 사용자 삭제
  fastify.delete("/delete-user/:id", async (req, reply) => {
    const { id } = req.params;
    try {
      const result = await req.db.query("DELETE FROM test_users WHERE id = ?", [
        id,
      ]);
      return { success: true, message: `ID ${id} 사용자 삭제 완료`, result };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });
}
