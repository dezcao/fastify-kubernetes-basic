import pg from "pg";

export async function initPostgre() {
  const pool = new pg.Pool({
    host: process.env.POSTGRE_HOST,
    user: process.env.POSTGRE_USER,
    password: process.env.POSTGRE_PASSWORD,
    database: process.env.POSTGRE_DATABASE,
    port: process.env.POSTGRE_PORT,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  // 연결 테스트 및 테스트 테이블 생성
  let client = null;
  try {
    client = await pool.connect();
    const { rows } = await client.query("SELECT 1 AS val");
    console.log("PostgreSQL 연결 성공:", rows);

    // 기본 테이블 자동 생성
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("test_users 테이블이 확인되었습니다.");
  } catch (err) {
    console.error("PostgreSQL 연결 실패:", err);
  } finally {
    if (client) client.release();
  }

  return pool;
}
