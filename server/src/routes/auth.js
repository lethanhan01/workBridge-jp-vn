"use strict";

import express from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config/authConstants.js";

const router = express.Router();

let users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin123@gmail.com",
    password: "password123",
    nationality: "Vietnam",
    gender: "Nam",
    department: "Quản trị",
  },
];

let nextId = 2;

router.post("/signup", (req, res) => {
  const { name, email, password, nationality, gender, department } = req.body;

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      message:
        "Email đã được sử dụng / メールアドレスは既に使用されています",
    });
  }

  const newUser = {
    id: nextId++,
    name,
    email,
    password,
    nationality,
    gender,
    department,
  };

  users.push(newUser);

  res.status(201).json({
    message: "Đăng ký thành công / 登録が完了しました！",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);

  if (!user || user.password !== password) {
    return res.status(401).json({
      message:
        "Email hoặc mật khẩu không đúng / メールアドレスまたはパスワードが正しくありません",
    });
  }

  const role = email.includes("admin") ? "admin" : "user";

  const token = jwt.sign(
    { id: user.id, email: user.email, role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Đăng nhập thành công",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role,
    },
  });
});

export default router;
