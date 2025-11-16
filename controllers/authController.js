import jwt from "jsonwebtoken";

const generateAccessToken = async (user) => {
  try {
    const token = jwt.sign(
      { username: user.usename },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "20m" }
    );

    return token;
  } catch (error) {
    console.error("Access Token Generation Error:", error.message);
    throw new Error("Failed to generate access token");
  }
};

const generateRefreshToken = async (user) => {
  try {
    const token = jwt.sign(
      { username: user.usename },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "10d",
      }
    );

    return token;
  } catch (error) {
    console.error("Refresh Token Generation Error:", error.message);
    throw new Error("Failed to generate refresh token");
  }
};

export { generateAccessToken, generateRefreshToken };
