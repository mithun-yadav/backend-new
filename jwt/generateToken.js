import jwt from "jsonwebtoken";

const createTokenAndSaveCookie = async (res, userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "7d",
  });

  console.log(userId, "userId===============");

  res.cookie("jwt", refreshToken, {
    httpOnly: true, // Protects against XSS attacks
    secure: process.env.NODE_ENV === "production", // Set to true in production
    sameSite: "strict", // Prevents CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return { accessToken, refreshToken };
};

export default createTokenAndSaveCookie;
