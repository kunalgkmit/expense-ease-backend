import { Sequelize } from "sequelize";
import createUserModel from "../model/userModel.js";
import createRoleModel from "../model/roleModel.js";
import createTransactionModel from "../model/transactionModel.js";

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
    console.log("Database connection established successfully.");

    // Initialize models
    Role = createRoleModel(sequelize);
    User = createUserModel(sequelize);
    Transaction = createTransactionModel(sequelize);

    // Setup associations
    if (Role.associate) Role.associate({ User, Transaction });
    if (User.associate) User.associate({ Role, Transaction });
    if (Transaction.associate) Transaction.associate({ User });

    // Sync all tables
    await sequelize.sync({ alter: true });
    console.log("All tables synchronized successfully.");

    // Seed default roles
    await Role.findOrCreate({ where: { name: "admin" } });
    await Role.findOrCreate({ where: { name: "user" } });
    console.log("Default roles seeded successfully.");

    return { sequelize, User, Role, Transaction };
  } catch (error) {
    console.error("Unable to connect or initialize database:", error);
    process.exit(1);
  }
};

// Export models individually for use elsewhere
export { sequelize, User, Role, Transaction };
