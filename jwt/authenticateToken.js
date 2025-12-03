import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  console.log("🔍 Incoming Headers:", req.headers);

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.error("⚠️ No Authorization header found!");
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const verifiedUser = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    console.log("✅ Token Verified:", verifiedUser);

    req.user = verifiedUser;
    next();
  } catch (err) {
    console.error("❌ Token Verification Error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default authenticateToken;
