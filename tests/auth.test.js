import app from "../server.js";
import request from "supertest";
import db from "../models/index.js";

const { User } = db;

describe("Auth API Tests", () => {
  let testEmail = `test${Date.now()}@mail.com`;
  let testPassword = "password123";
  let testName = "TestUser";

  test("Register success", async () => {
    const res = await request(app).post("/api/register").send({
      name: testName,
      email: testEmail,
      password: testPassword,
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user.email).toBe(testEmail);
  });

  test("Register fail (duplicate email)", async () => {
    const res = await request(app).post("/api/register").send({
      name: testName,
      email: testEmail,
      password: testPassword,
    });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("User already exists");
  });

  test("Login success", async () => {
    const res = await request(app).post("/api/login").send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User logged in successfully");
    expect(res.body.userData).toHaveProperty("accessToken");
    expect(res.body.userData).toHaveProperty("refreshToken");
  });

  test("Login fail (wrong password)", async () => {
    const res = await request(app).post("/api/login").send({
      email: testEmail,
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
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
