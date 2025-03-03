import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectMongoDB from "./config/db";

dotenv.config();

connectMongoDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express!");
});

export { app };
