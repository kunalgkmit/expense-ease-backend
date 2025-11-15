import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
dotenv.config();

export async function up(queryInterface) {
  const hashedPassword = await bcryptjs.hash("admin@123", 12);
  await queryInterface.bulkInsert("users", [
    {
      name: "ADMIN",
      email: "admin@gmail.com",
      password: hashedPassword,
      role_id: "b9e0e7b5-4f4b-4e54-9a02-7f5f112b9af7",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("users", { email: "admin@gmail.com" }, {});
}
