import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import process from "process";
import { fileURLToPath } from "url";
import { createRequire } from "module";

import createUserModel from "./User.js";
import createRoleModel from "./Role.js";
import createTransactionModel from "./Transaction.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);
const configPath = path.join(__dirname, "../config/config.cjs");
const configData = require(configPath);

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

export default { sequelize, Sequelize, Role, User, Transaction };
