import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { dbConnection } from "./db/db.js";
import { userRouter } from "./routes/user.routes.js";

dotenv.config();

const server = express();
const PORT = process.env.PORT || 8080;

// Middlewares
server.use(cors());
server.use(express.json());
server.use(cookieParser());
server.use(express.urlencoded({ extended: true }));
server.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//Routes
server.use("/api/v1/auth", userRouter)

// Database
const main = async () => {
  try {
    await dbConnection();

    server.listen(PORT, () => {
      console.log(`Server is running on port: http://localhost:${PORT} 😎`);
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

main();