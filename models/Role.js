import { DataTypes } from "sequelize";

const createRoleModel = (sequelize) => {
  const Role = sequelize.define("role", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: "role_id",
      onDelete: "CASCADE",
    });
  };

  return Role;
};

export default createRoleModel;
