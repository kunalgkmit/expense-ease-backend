import jwt from "jsonwebtoken";

const generateAccessToken = async (user) => {
  const token = jwt.sign(
    { username: user.usename },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "20min",
    }
  );
  return token;
};

const generateRefreshToken = async (user) => {
  const token = jwt.sign(
    { username: user.usename },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "10d",
    }
  );
  return token;
};

export { generateAccessToken, generateRefreshToken };
