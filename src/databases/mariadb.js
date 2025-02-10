import mariadb from "mariadb";

export async function initMariadb() {
  const pool = mariadb.createPool({
    host: process.env.MARIADB_HOST,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE,
    port: process.env.MARIADB_PORT,
    connectionLimit: 5,
  });

  // 연결 테스트 및 테스트 테이블 생성.
  let conn = null;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT 1 as val");
    console.log("MariaDB 연결 성공:", rows);

    // 기본 테이블 자동 생성
    await conn.query(`
      CREATE TABLE IF NOT EXISTS test_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("test_users 테이블이 확인되었습니다.");
  } catch (err) {
    console.error("MariaDB 연결 실패:", err);
  } finally {
    if (conn) conn.release();
  }

  return pool;
}
