import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import process from "process";
import { fileURLToPath } from "url";

import createUserModel from "./user.js";
import createRoleModel from "./role.js";
import createTransactionModel from "./transaction.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, "../config/config.json");
const rawConfig = fs.readFileSync(configPath);
const configData = JSON.parse(rawConfig);

const env = process.env.NODE_ENV || "development";
const config = configData[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const Role = createRoleModel(sequelize);
const User = createUserModel(sequelize);
const Transaction = createTransactionModel(sequelize);

if (Role.associate) Role.associate({ User, Transaction });
if (User.associate) User.associate({ Role, Transaction });
if (Transaction.associate) Transaction.associate({ User });

export default { sequelize, Sequelize, Role, User, Transaction };
