import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import MessageRouter from "./routes/message.route.js";
import { app, server, io } from "./socketIO/server.js";

dotenv.config();
const port = process.env.PORT || 5000;
const URI = process.env.MONGODB_URI;

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

// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:4001", // ✅ Your frontend URL
    credentials: true, // ✅ Allows sending cookies
  })
);
app.use(cookieParser());

try {
  await mongoose.connect(URI);
  console.log("Database connected!");
} catch (error) {
  console.log(error);
}

app.use("/api/user", userRoutes);
app.use("/api/message", MessageRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

server.listen(port, () => {
  console.log("Server is listening at port", port);
});
