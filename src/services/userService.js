export async function getUserService(name) {
  console.log("서비스 로직 처리");
  return `Hello, ${name || "User"}!`;
}

export async function postUserService(request) {
  const { name, eamil } = request.body;

  // todo. SQL 동적 파싱
  const result = await request.db.query("INSERT INTO test_users (name, email) VALUES (?, ?)", [name, email]);
  return `Hello, ${name || "User"}!`;
}
