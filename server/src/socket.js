"use strict";

/**
 * Socket.IO — JWT bắt buộc qua handshake.auth.token
 *
 * Client → Server
 *   join_room      { userId }
 *   send_message   { senderId, receiverId, content, type?, ma_cuoc_hoi_thoai?, ma_nguoi_gui? }
 *                  Để lưu DB (Supabase bảng tinnhan): gửi ma_cuoc_hoi_thoai + ma_nguoi_gui (UUID).
 *                  JWT có ma_nguoi_dung thì phải khớp ma_nguoi_gui.
 *
 * Server → Client
 *   receive_message  { id|ma_tin_nhan, senderId, receiverId, content, type, createdAt }
 */

import jwt from "jsonwebtoken";
import { Server } from "socket.io";

import { JWT_SECRET } from "./config/authConstants.js";
import { isSupabaseConfigured } from "./db/supabase.js";
import { insertTinNhan } from "./repositories/tinnhanRepository.js";
import { isUuid } from "./utils/isUuid.js";

const onlineUsers = new Map();

function senderMatchesToken(authUser, senderId, ma_nguoi_gui) {
  if (authUser.ma_nguoi_dung) {
    return ma_nguoi_gui === authUser.ma_nguoi_dung;
  }
  if (authUser.id != null && senderId != null) {
    return String(authUser.id) === String(senderId);
  }
  return true;
}

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("AUTH_MISSING_TOKEN"));
    }
    try {
      socket.authUser = jwt.verify(token, JWT_SECRET);
      next();
    } catch {
      next(new Error("AUTH_INVALID_TOKEN"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    socket.on("join_room", ({ userId }) => {
      if (!userId) return;
      onlineUsers.set(String(userId), socket.id);
      console.log(`[Socket] User ${userId} online → ${socket.id}`);
      socket.broadcast.emit("user_online", { userId });
    });

    socket.on("send_message", async (data) => {
      const {
        senderId,
        receiverId,
        content,
        type = "text",
        ma_cuoc_hoi_thoai,
        ma_nguoi_gui,
      } = data || {};

      if (!senderMatchesToken(socket.authUser, senderId, ma_nguoi_gui)) {
        socket.emit("send_message_error", {
          message: "senderId / ma_nguoi_gui không khớp JWT",
        });
        return;
      }

      const resolvedGuid =
        ma_nguoi_gui ||
        (isUuid(String(senderId)) ? String(senderId) : null);

      let dbRow = null;
      if (
        isSupabaseConfigured &&
        ma_cuoc_hoi_thoai &&
        isUuid(ma_cuoc_hoi_thoai) &&
        resolvedGuid
      ) {
        try {
          dbRow = await insertTinNhan({
            ma_cuoc_hoi_thoai,
            ma_nguoi_gui: resolvedGuid,
            noi_dung: content ?? null,
            trang_thai: "sent",
          });
        } catch (e) {
          console.error("[Socket] Lưu tinnhan thất bại:", e.message || e);
        }
      }

      const messagePayload = dbRow
        ? {
            id: dbRow.ma_tin_nhan,
            ma_tin_nhan: dbRow.ma_tin_nhan,
            senderId: resolvedGuid || senderId,
            receiverId,
            content,
            type,
            createdAt: dbRow.time,
          }
        : {
            id: `temp-${Date.now()}`,
            senderId,
            receiverId,
            content,
            type,
            createdAt: new Date().toISOString(),
          };

      const receiverSocketId = onlineUsers.get(String(receiverId));
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", messagePayload);
      }

      socket.emit("receive_message", messagePayload);

      console.log(
        `[Socket] Message: ${senderId} → ${receiverId} | "${content}"`
      );
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          socket.broadcast.emit("user_offline", { userId });
          console.log(`[Socket] User ${userId} offline`);
          break;
        }
      }
    });
  });

  return io;
}

export { initSocket, onlineUsers };
