import request from "supertest";
import app from "../server.js";
import db from "../models/index.js";

const { User, Transaction } = db;

describe("Transaction API Tests", () => {
  let user;
  let transactionId;

  const testUserData = {
    name: "TxnUser",
    email: `txn${Date.now()}@mail.com`,
    password: "pass123",
  };

  beforeAll(async () => {
    user = await User.create({
      ...testUserData,
      role_id: process.env.DEFAULT_USER_ID,
    });
  });

  afterAll(async () => {
    await Transaction.destroy({ where: { user_id: user.id } });
    await User.destroy({ where: { id: user.id } });
    await db.sequelize.close();
  });

  test("Create transaction success", async () => {
    const res = await request(app).post("/api/transactions").send({
      user_id: user.id,
      title: "Food",
      amount: -100,
    });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Food");
    transactionId = res.body.id;
  });

  test("Create transaction fail (missing amount)", async () => {
    const res = await request(app).post("/api/transactions").send({
      user_id: user.id,
      title: "Invalid Transaction",
    });

    expect(res.status).toBe(400);
  });

  test("Get summary success", async () => {
    const res = await request(app).get(`/api/transactions/summary/${user.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalBalance");
    expect(res.body).toHaveProperty("totalIncome");
    expect(res.body).toHaveProperty("totalExpense");
  });

  test("Get summary fail - no user id", async () => {
    const res = await request(app).get(`/api/transactions/summary/`);
    expect(res.status).toBe(404);
  });
});
