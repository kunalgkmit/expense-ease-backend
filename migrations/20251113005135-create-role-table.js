export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("roles", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("now"),
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("now"),
    },
    deletedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("roles");
}
