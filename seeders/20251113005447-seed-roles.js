export async function up(queryInterface) {
  await queryInterface.bulkInsert("roles", [
    {
      id: "b9e0e7b5-4f4b-4e54-9a02-7f5f112b9af7",
      name: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "b9e0e7b5-4f4b-4e54-9a02-7f5f112b9af8",
      name: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("roles", null, {});
}
