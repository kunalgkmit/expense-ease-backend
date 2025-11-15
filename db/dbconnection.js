import { Sequelize } from "sequelize";
import createUserModel from "../models/user.js";
import createRoleModel from "../models/role.js";
import createTransactionModel from "../models/transaction.js";
import dotenv from "dotenv";

dotenv.config();

let sequelize;
let User;
let Role;
let Transaction;

export const dbConnection = async (database, username, password) => {
  sequelize = new Sequelize(database, username, password, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  });

  try {
    await sequelize.authenticate();

    Role = createRoleModel(sequelize);
    User = createUserModel(sequelize);
    Transaction = createTransactionModel(sequelize);

    if (Role.associate) Role.associate({ User, Transaction });
    if (User.associate) User.associate({ Role, Transaction });
    if (Transaction.associate) Transaction.associate({ User });

    return { sequelize, User, Role, Transaction };
  } catch (error) {
    process.exit(1);
  }
};

export { sequelize, User, Role, Transaction };
