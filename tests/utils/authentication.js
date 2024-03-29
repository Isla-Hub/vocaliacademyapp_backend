import request from "supertest";

async function getAuthenticatedAgent(app) {
  const agent = request.agent(app);
  const res = await agent
    .post("/api/v1/auth/login")
    .send({ email: "admin@myapp.com", password: "test1234" });

  agent.set("Authorization", `Bearer ${res.body.token}`);

  if (res.body.userId) {
    agent.userId = res.body.userId;
  }
  return agent;
}

async function getAuthenticatedStudentUser(app) {
  const agent = request.agent(app);
  const res = await agent
    .post("/api/v1/auth/login")
    .send({ email: "student@myapp.com", password: "test1234" });

  agent.set("Authorization", `Bearer ${res.body.token}`);

  if (res.body.userId) {
    agent.userId = res.body.userId;
  }

  return agent;
}

export { getAuthenticatedAgent, getAuthenticatedStudentUser };
