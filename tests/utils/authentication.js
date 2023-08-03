import request from "supertest";

async function getAuthenticatedAgent(app) {
  const agent = request.agent(app);
  const res = await agent
    .post("/api/v1/auth/login")
    .send({ email: "admin@myapp.com", password: "test1234" });

  agent.set("Authorization", `Bearer ${res.body.token}`);
  console.log("1111111111111111111111111111111", res.body.token);

  return agent;
}

export { getAuthenticatedAgent };
