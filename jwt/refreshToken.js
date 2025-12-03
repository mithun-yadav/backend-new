import jwt from "jsonwebtoken";

const refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.jwt;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Refresh token not found. Please log in again." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_ACCESS_TOKEN,
      {
        expiresIn: "15m",
      }
    );
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Invalid or expired refresh token." });
  }
};

export default refreshToken;
