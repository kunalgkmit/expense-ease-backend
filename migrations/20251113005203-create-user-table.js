export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("users", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      allowNull: false,
      primaryKey: true,
    },
    role_id: {
      type: Sequelize.UUID,
      references: {
        model: "roles",
        key: "id",
      },
      onDelete: "CASCADE",
      allowNull: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: Sequelize.TEXT,
      allowNull: true,
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
  await queryInterface.dropTable("users");
}
