import { DataTypes } from "sequelize";

const createTransactionModel = (sequelize) => {
  const Transaction = sequelize.define("transaction", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    occurredAt: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
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

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return Transaction;
};

export default createTransactionModel;
