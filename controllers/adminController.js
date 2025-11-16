import db from "../models/index.js";

const { User } = db;

export const getAllUsersData = async (req, res) => {
  try {
    const totalUsers = await User.count();

    const users = await User.findAll({
      attributes: ["name", "email"],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      totalUsers,
      users,
    });
  } catch (error) {
    console.error("Error fetching users data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
