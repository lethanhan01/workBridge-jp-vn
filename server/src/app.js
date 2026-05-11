"use strict";

import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import createError from "http-errors";
import logger from "morgan";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import authRouter from "./routes/auth.js";
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set("views", join(__dirname, "..", "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "..", "public")));

app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  const wantsJson =
    req.path.startsWith("/api") ||
    (req.headers.accept && req.headers.accept.includes("application/json"));

  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  const status = err.status || 500;
  res.status(status);

  if (wantsJson) {
    return res.json({
      message: err.message,
      ...(req.app.get("env") === "development" && {
        stack: err.stack,
        status,
      }),
    });
  }

  res.render("error");
});

export default app;
