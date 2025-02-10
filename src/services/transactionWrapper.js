export async function withTransaction(request, handler) {
  const db = request.db; // pool에서 꺼낸 1커넥션.

  if (db) {
    try {
      await db.begin(); // 트랜잭션 시작

      // await db.query(query, values); -- logger
      const result = await handler(); // 비즈니스 로직 실행

      await db.commit();
      db.release();

      return result;
    } catch (error) {
      await db.rollback(); // 오류 발생 시 롤백
      db.release();
      console.error("트랜잭션 롤백 발생:", error);
      throw error; // 오류 다시 던지기
    }
  } else {
    console.log("데이터베이스 연결이 없습니다.");
    const result = await handler(); // 비즈니스 로직 실행
    return result;
  }
}
