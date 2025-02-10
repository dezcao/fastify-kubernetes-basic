export default async function monoCheck(fastify) {
  fastify.get("/m-users", async (req, reply) => {
    const users = await fastify.mongo.db.collection("users").find().toArray();
    return users;
  });

  fastify.post("/m-users", async (req, reply) => {
    const { name, email } = req.body;
    const result = await fastify.mongo.db
      .collection("users")
      .insertOne({ name, email });
    return { message: "사용자 추가 완료!", id: result.insertedId };
  });
}
