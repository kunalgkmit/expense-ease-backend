import request from "supertest";
import app from "../server.js";
import db from "../models/index.js";

const { User } = db;

describe("Admin API Tests - Get All Users", () => {
  beforeEach(async () => {
    await User.destroy({ where: {}, force: true });
  });

  test("GET /api/admin/users - should return total users & user list", async () => {
    await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: "hashedpass",
      role_id: process.env.DEFAULT_USER_ID,
    });

    const res = await request(app).get("/api/admin/users");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.totalUsers).toBe(1);
    expect(res.body.users.length).toBe(1);
    expect(res.body.users[0]).toHaveProperty("email", "john@example.com");
  });
});
