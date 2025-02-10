import oracledb from "oracledb";

export async function initOracle() {
  let connection = null;
  try {
    // 커넥션 풀 생성
    const pool = await oracledb.createPool({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_SERVICE}`,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1,
    });

    // 연결 테스트
    connection = await pool.getConnection();
    const result = await connection.execute("SELECT SYSDATE FROM dual");
    console.log("OracleDB 연결 성공:", result.rows);

    return pool;
  } catch (err) {
    console.error("OracleDB 연결 실패:", err);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
