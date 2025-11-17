import db from "../models/index.js";

const { Transaction } = db;

export const create = async (req, res) => {
  try {
    const { user_id, title, amount } = req.body;

    if (!user_id || !title || !amount) {
      return res
        .status(400)
        .json({ message: "Invalid user_id, title, or amount" });
    }

    const transaction = await Transaction.create({
      user_id,
      title,
      amount,
      occurredAt: new Date().toISOString().split("T")[0],
    });

    const { id, createdAt } = transaction;
    return res.status(201).json({
      id,
      user_id,
      title,
      amount,
      created_at: createdAt,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getSummary = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const transactions = await Transaction.findAll({
      where: { user_id, deletedAt: null },
      attributes: [
        [
          Transaction.sequelize.fn("SUM", Transaction.sequelize.col("amount")),
          "totalBalance",
        ],
        [
          Transaction.sequelize.fn(
            "SUM",
            Transaction.sequelize.literal(
              `CASE WHEN "amount" > 0 THEN "amount" ELSE 0 END`
            )
          ),
          "totalIncome",
        ],
        [
          Transaction.sequelize.fn(
            "SUM",
            Transaction.sequelize.literal(
              `CASE WHEN "amount" < 0 THEN "amount" ELSE 0 END`
            )
          ),
          "totalExpense",
        ],
      ],
      raw: true,
    });

    const totalBalance = parseFloat(transactions[0].totalBalance || 0);
    const totalIncome = parseFloat(transactions[0].totalIncome || 0);
    const totalExpense = parseFloat(transactions[0].totalExpense || 0);

    return res.status(200).json({
      totalBalance,
      totalIncome,
      totalExpense,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getRecent = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const transactions = await Transaction.findAll({
      where: { user_id, deletedAt: null },
      attributes: [
        "id",
        "user_id",
        "title",
        "amount",
        ["createdAt", "created_at"],
      ],
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    return res.status(200).json(transactions);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteOne = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.body.user_id || req.query.user_id;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const transaction = await Transaction.findOne({
      where: { id, user_id, deletedAt: null },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await transaction.update({ deletedAt: new Date() });

    return res
      .status(200)
      .json({ message: "Transaction deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, title, amount } = req.body;

    if (!user_id || !id) {
      return res
        .status(400)
        .json({ message: "user_id and transaction_id are required" });
    }

    if (!title && !amount) {
      return res.status(400).json({
        message:
          "At least one field (title or amount) must be provided to update",
      });
    }

    const transaction = await Transaction.findOne({
      where: { id, user_id, deletedAt: null },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (amount) updatedFields.amount = amount;

    await transaction.update(updatedFields);

    return res.status(200).json({
      message: "Transaction updated successfully",
      updated_transaction: {
        id: transaction.id,
        user_id: transaction.user_id,
        title: transaction.title,
        amount: transaction.amount,
        created_at: transaction.createdAt,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
