// Package imports
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

export const app = express();

app
  .use(morgan("dev"))
  .use(helmet())
  .use(express.urlencoded({ extended: true }))
  .use(express.json());

app.get("/health-check", (req, res) => {
  res.status(200).json({ message: "Server is Ready!" });
});
