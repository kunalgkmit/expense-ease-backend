import app from "../server.js";
import request from "supertest";
import db from "../models/index.js";

const { User } = db;

describe("Auth API Tests", () => {
  let testEmail = `test${Date.now()}@mail.com`;
  let testPassword = "password123";

  test("Register success", async () => {
    const res = await request(app).post("/api/register").send({
      name: "TestUser",
      email: testEmail,
      password: testPassword,
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });

  test("Login fail (wrong password)", async () => {
    const res = await request(app).post("/api/login").send({
      email: testEmail,
      password: "wrong",
    });

    expect(res.status).toBe(401);
  });

  afterAll(async () => {
    try {
      await User.destroy({
        where: { email: testEmail },
      });

      await db.sequelize.close();
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  });
});
