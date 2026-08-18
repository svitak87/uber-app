import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.DB_CONNECT)
    .then(() => {
      console.log(`Database connected: 📈`);
    })
    .catch((error) => {
      console.log("There's an error connection with database 📉")
      console.error("Database connection error:", error);
      process.exit(1)
    });

};