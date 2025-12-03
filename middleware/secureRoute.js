import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const secureRoute = async (req, res, next) => {
  console.log("Headers:", req.headers); // Check incoming headers

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("No Authorization header");
    return res.status(401).json({ message: "Access token required" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token:", token);
  try {
    const verified = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    req.user = await User.findById(verified.userId).select("-password");
    if (!req.user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    next();
  } catch (err) {
    console.log("Token error:", err.message);
    res.status(403).json({ message: "Invalid token" });
  }
};

export default secureRoute;
