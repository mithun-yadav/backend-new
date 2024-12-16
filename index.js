import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
const port = process.env.PORT || 5000;
const URI = process.env.MONGODB_URI;

// Enhanced JSON parsing middleware
app.use(express.json());
// Add error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON payload",
      error: err.message,
    });
  }
  next();
});

app.use(cors());
app.use(cookieParser());

try {
  await mongoose.connect(URI);
  console.log("Database connected!");
} catch (error) {
  console.log(error);
}

// app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log("Server is listening at port", port);
});
