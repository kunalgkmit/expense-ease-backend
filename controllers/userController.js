import { User, Role } from "../db/dbconnection.js";
import bcryptjs from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existUser = await User.findOne({ where: { email } });
    if (existUser) {
      return res.status(409).json("User already exists");
    }
    const hashedPass = await bcryptjs.hash(password, 10);
    const user = await User.create({
      ...req.body,
      password: hashedPass,
    });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
};

export const login = async (req, res) => {
  try {
    const { password, email } = req.body;
    const exist = await User.findOne({ where: { email: email } });
    if (exist != null) {
      const isValid = await bcryptjs.compare(password, exist.password);
      if (!isValid) {
        return res.status(401).json("Credential invalid");
      }
      return res.send("Login success");
    }
  } catch (error) {
    res.status(500).json("Internal error");
  }
};
