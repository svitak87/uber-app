import express from "express";
import dotenv from "dotenv";
import cors from "cors"

dotenv.config();

const server = express();
const PORT = process.env.PORT || 8080;


server.use(cors())

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});