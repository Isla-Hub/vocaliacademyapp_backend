import request from "supertest";

async function getAuthenticatedAgent(app) {
  const agent = request.agent(app);
  const res = await agent
    .post("/api/v1/auth")
    .send({ email: "testeremail@example.com", password: "test1234" });

  agent.set("Authorization", `Bearer ${res.body.token}`);
  return agent;
}

export { getAuthenticatedAgent };
