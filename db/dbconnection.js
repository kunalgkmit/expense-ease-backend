import { Sequelize } from "sequelize";
import createUserModel from "../models/user.js";
import createRoleModel from "../models/role.js";
import createTransactionModel from "../models/transaction.js";

let sequelize;
let User;
let Role;
let Transaction;

export const dbConnection = async (database, username, password) => {
  sequelize = new Sequelize(database, username, password, {
    host: "localhost",
    dialect: "postgres",
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
    await sequelize.sync({ alter: true });
    await Role.findOrCreate({ where: { name: "admin" } });
    await Role.findOrCreate({ where: { name: "user" } });

    return { sequelize, User, Role, Transaction };
  } catch (error) {
    process.exit(1);
  }
};

export { sequelize, User, Role, Transaction };
