import db from "../models/index.js";
import express from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "./auth/auth.js";
import { response } from "express";

const { User } = db;

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existUser = await User.findOne({ where: { email } });
    if (existUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPass = await bcryptjs.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPass,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const exist = await User.findOne({
      where: username ? { name: username } : { email },
    });

    if (!exist) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isValid = await bcryptjs.compare(password, exist.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = await generateAccessToken(exist.dataValues);
    const refreshToken = await generateRefreshToken(exist.dataValues);

    await exist.update({ refreshToken });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      userData: {
        id: exist.id,
        username: exist.name,
        email: exist.email,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh token missing" });
    }

    const user = await User.findOne({ where: { refreshToken } });
    if (!user) {
      return res
        .status(403)
        .json({ message: "User not found or invalid token" });
    }

    jwt.verify(refreshToken, "cdef", async (error, decoded) => {
      if (error) {
        return res
          .status(403)
          .json({ message: "Invalid or expired refresh token" });
      }
      const newAccessToken = await generateAccessToken(user.dataValues);

      return res.status(200).json({
        message: "Access token refreshed successfully",
        accessToken: newAccessToken,
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh token missing" });
    }

    const user = await User.findOne({ where: { refreshToken } });

    if (user) {
      await user.update({ refreshToken: null });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
