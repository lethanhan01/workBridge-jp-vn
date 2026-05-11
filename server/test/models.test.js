"use strict";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createTestDb } from "./helpers/setupModels.js";

describe("Sequelize models", () => {
  let ctx;

  beforeEach(async () => {
    ctx = await createTestDb();
  });

  afterEach(async () => {
    if (ctx?.sequelize) {
      await ctx.sequelize.close();
    }
  });

  describe("VaiTro", () => {
    it("has correct modelName and tableName", () => {
      expect(ctx.VaiTro.name).toBe("VaiTro");
      expect(ctx.VaiTro.tableName).toBe("vai_tro");
    });

    it("creates row when ten_vai_tro is set", async () => {
      const row = await ctx.VaiTro.create({ ten_vai_tro: "admin" });
      expect(row.ma_vai_tro).toBeTruthy();
      expect(row.ten_vai_tro).toBe("admin");
    });
  });

  describe("NguoiDung", () => {
    it("has correct modelName and tableName", () => {
      expect(ctx.NguoiDung.name).toBe("NguoiDung");
      expect(ctx.NguoiDung.tableName).toBe("nguoi_dung");
    });

    it("creates row with required fields", async () => {
      const row = await ctx.NguoiDung.create({
        ten_dang_nhap: "user1",
        matkhau: "secret",
        email: "user1@example.com",
      });
      expect(row.ma_nguoi_dung).toBeTruthy();
    });

    it("belongsTo VaiTro via ma_vai_tro", async () => {
      const role = await ctx.VaiTro.create({ ten_vai_tro: "member" });
      const user = await ctx.NguoiDung.create({
        ma_vai_tro: role.ma_vai_tro,
        ten_dang_nhap: "member1",
        matkhau: "secret",
        email: "member1@example.com",
      });
      const loaded = await ctx.NguoiDung.findByPk(user.ma_nguoi_dung, {
        include: [{ model: ctx.VaiTro, as: "vai_tro" }],
      });
      expect(loaded.vai_tro).toBeTruthy();
      expect(loaded.vai_tro.ma_vai_tro).toBe(role.ma_vai_tro);
    });

    it("belongsToMany TuChuyenNganh through nguoi_dung_yeu_thich_tu", async () => {
      const user = await ctx.NguoiDung.create({
        ten_dang_nhap: "fan1",
        matkhau: "secret",
        email: "fan1@example.com",
      });
      const term = await ctx.TuChuyenNganh.create({
        chuyen_nganh: "backend",
        thuat_ngu_tieng_viet: "API",
      });
      await user.setDanh_sach_tu_yeu_thich([term]);
      const loaded = await ctx.NguoiDung.findByPk(user.ma_nguoi_dung, {
        include: [{ model: ctx.TuChuyenNganh, as: "danh_sach_tu_yeu_thich" }],
      });
      expect(loaded.danh_sach_tu_yeu_thich).toHaveLength(1);
      expect(loaded.danh_sach_tu_yeu_thich[0].ma_tu).toBe(term.ma_tu);
    });
  });

  describe("TuChuyenNganh", () => {
    it("has correct modelName and tableName", () => {
      expect(ctx.TuChuyenNganh.name).toBe("TuChuyenNganh");
      expect(ctx.TuChuyenNganh.tableName).toBe("tu_chuyen_nganh");
    });

    it("creates row", async () => {
      const row = await ctx.TuChuyenNganh.create({
        chuyen_nganh: "frontend",
      });
      expect(row.ma_tu).toBeTruthy();
    });
  });

  describe("CuocHoiThoai", () => {
    it("has correct modelName and tableName", () => {
      expect(ctx.CuocHoiThoai.name).toBe("CuocHoiThoai");
      expect(ctx.CuocHoiThoai.tableName).toBe("cuoc_hoi_thoai");
    });

    it("creates row", async () => {
      const row = await ctx.CuocHoiThoai.create({
        ten_cuoc_hoi_thoai: "Room A",
      });
      expect(row.ma_cuoc_hoi_thoai).toBeTruthy();
    });

    it("belongsToMany NguoiDung through ThanhVienHoiThoai", async () => {
      const conv = await ctx.CuocHoiThoai.create({});
      const user = await ctx.NguoiDung.create({
        ten_dang_nhap: "chat1",
        matkhau: "secret",
        email: "chat1@example.com",
      });
      await conv.addNguoi_dung_tham_gia(user);
      const loaded = await ctx.CuocHoiThoai.findByPk(conv.ma_cuoc_hoi_thoai, {
        include: [{ model: ctx.NguoiDung, as: "nguoi_dung_tham_gia" }],
      });
      expect(loaded.nguoi_dung_tham_gia).toHaveLength(1);
      expect(loaded.nguoi_dung_tham_gia[0].ma_nguoi_dung).toBe(user.ma_nguoi_dung);
    });
  });

  describe("ThanhVienHoiThoai", () => {
    it("has correct modelName and tableName", () => {
      expect(ctx.ThanhVienHoiThoai.name).toBe("ThanhVienHoiThoai");
      expect(ctx.ThanhVienHoiThoai.tableName).toBe("thanhvienhoithoai");
    });

    it("links NguoiDung and CuocHoiThoai", async () => {
      const conv = await ctx.CuocHoiThoai.create({});
      const user = await ctx.NguoiDung.create({
        ten_dang_nhap: "tv1",
        matkhau: "secret",
        email: "tv1@example.com",
      });
      await ctx.ThanhVienHoiThoai.create({
        ma_cuoc_hoi_thoai: conv.ma_cuoc_hoi_thoai,
        ma_nguoi_dung: user.ma_nguoi_dung,
      });
      const row = await ctx.ThanhVienHoiThoai.findOne({
        where: {
          ma_cuoc_hoi_thoai: conv.ma_cuoc_hoi_thoai,
          ma_nguoi_dung: user.ma_nguoi_dung,
        },
        include: [
          { model: ctx.NguoiDung, as: "nguoi_dung" },
          { model: ctx.CuocHoiThoai, as: "cuoc_hoi_thoai" },
        ],
      });
      expect(row.nguoi_dung.ma_nguoi_dung).toBe(user.ma_nguoi_dung);
      expect(row.cuoc_hoi_thoai.ma_cuoc_hoi_thoai).toBe(conv.ma_cuoc_hoi_thoai);
    });
  });

  describe("TinNhan", () => {
    it("has correct modelName and tableName", () => {
      expect(ctx.TinNhan.name).toBe("TinNhan");
      expect(ctx.TinNhan.tableName).toBe("tinnhan");
    });

    it("belongsTo CuocHoiThoai and NguoiDung", async () => {
      const conv = await ctx.CuocHoiThoai.create({});
      const user = await ctx.NguoiDung.create({
        ten_dang_nhap: "sender",
        matkhau: "secret",
        email: "sender@example.com",
      });
      const msg = await ctx.TinNhan.create({
        ma_cuoc_hoi_thoai: conv.ma_cuoc_hoi_thoai,
        ma_nguoi_gui: user.ma_nguoi_dung,
        noi_dung: "hello",
      });
      const loaded = await ctx.TinNhan.findByPk(msg.ma_tin_nhan, {
        include: [
          { model: ctx.CuocHoiThoai, as: "cuoc_hoi_thoai" },
          { model: ctx.NguoiDung, as: "nguoi_gui" },
        ],
      });
      expect(loaded.cuoc_hoi_thoai.ma_cuoc_hoi_thoai).toBe(conv.ma_cuoc_hoi_thoai);
      expect(loaded.nguoi_gui.ma_nguoi_dung).toBe(user.ma_nguoi_dung);
    });

    it("hasOne BanDich", async () => {
      const conv = await ctx.CuocHoiThoai.create({});
      const user = await ctx.NguoiDung.create({
        ten_dang_nhap: "sender2",
        matkhau: "secret",
        email: "sender2@example.com",
      });
      const msg = await ctx.TinNhan.create({
        ma_cuoc_hoi_thoai: conv.ma_cuoc_hoi_thoai,
        ma_nguoi_gui: user.ma_nguoi_dung,
        noi_dung: "konichiwa",
      });
      await ctx.BanDich.create({
        ma_tin_nhan: msg.ma_tin_nhan,
        noidungoc: "konichiwa",
        noi_dung_da_dich: "こんにちは",
      });
      const loaded = await ctx.TinNhan.findByPk(msg.ma_tin_nhan, {
        include: [{ model: ctx.BanDich, as: "ban_dich" }],
      });
      expect(loaded.ban_dich).toBeTruthy();
      expect(loaded.ban_dich.ma_tin_nhan).toBe(msg.ma_tin_nhan);
    });
  });

  describe("BanDich", () => {
    it("has correct modelName and tableName", () => {
      expect(ctx.BanDich.name).toBe("BanDich");
      expect(ctx.BanDich.tableName).toBe("bandich");
    });

    it("belongsTo TinNhan", async () => {
      const conv = await ctx.CuocHoiThoai.create({});
      const user = await ctx.NguoiDung.create({
        ten_dang_nhap: "sender3",
        matkhau: "secret",
        email: "sender3@example.com",
      });
      const msg = await ctx.TinNhan.create({
        ma_cuoc_hoi_thoai: conv.ma_cuoc_hoi_thoai,
        ma_nguoi_gui: user.ma_nguoi_dung,
      });
      const bd = await ctx.BanDich.create({
        ma_tin_nhan: msg.ma_tin_nhan,
      });
      const loaded = await ctx.BanDich.findByPk(bd.ma_ban_dich, {
        include: [{ model: ctx.TinNhan, as: "tin_nhan" }],
      });
      expect(loaded.tin_nhan.ma_tin_nhan).toBe(msg.ma_tin_nhan);
    });
  });

  describe("PhanTichYNghia", () => {
    it("has correct modelName and tableName", () => {
      expect(ctx.PhanTichYNghia.name).toBe("PhanTichYNghia");
      expect(ctx.PhanTichYNghia.tableName).toBe("phan_tich_y_nghia");
    });

    it("belongsTo TinNhan and hasMany GoiY", async () => {
      const conv = await ctx.CuocHoiThoai.create({});
      const user = await ctx.NguoiDung.create({
        ten_dang_nhap: "sender4",
        matkhau: "secret",
        email: "sender4@example.com",
      });
      const msg = await ctx.TinNhan.create({
        ma_cuoc_hoi_thoai: conv.ma_cuoc_hoi_thoai,
        ma_nguoi_gui: user.ma_nguoi_dung,
      });
      const pt = await ctx.PhanTichYNghia.create({
        ma_tin_nhan: msg.ma_tin_nhan,
        sac_thai: "neutral",
      });
      await ctx.GoiY.create({
        ma_y_dinh: pt.ma_y_dinh,
        noi_dung_tieng_viet: "gợi ý",
      });
      const loaded = await ctx.PhanTichYNghia.findByPk(pt.ma_y_dinh, {
        include: [
          { model: ctx.TinNhan, as: "tin_nhan" },
          { model: ctx.GoiY, as: "danh_sach_goi_y" },
        ],
      });
      expect(loaded.tin_nhan.ma_tin_nhan).toBe(msg.ma_tin_nhan);
      expect(loaded.danh_sach_goi_y).toHaveLength(1);
    });
  });

  describe("GoiY", () => {
    it("has correct modelName and tableName", () => {
      expect(ctx.GoiY.name).toBe("GoiY");
      expect(ctx.GoiY.tableName).toBe("goi_y");
    });

    it("belongsTo PhanTichYNghia", async () => {
      const conv = await ctx.CuocHoiThoai.create({});
      const user = await ctx.NguoiDung.create({
        ten_dang_nhap: "sender5",
        matkhau: "secret",
        email: "sender5@example.com",
      });
      const msg = await ctx.TinNhan.create({
        ma_cuoc_hoi_thoai: conv.ma_cuoc_hoi_thoai,
        ma_nguoi_gui: user.ma_nguoi_dung,
      });
      const pt = await ctx.PhanTichYNghia.create({
        ma_tin_nhan: msg.ma_tin_nhan,
      });
      const gy = await ctx.GoiY.create({
        ma_y_dinh: pt.ma_y_dinh,
        muc_do_phu_hop: 90,
      });
      const loaded = await ctx.GoiY.findByPk(gy.ma_goi_y, {
        include: [{ model: ctx.PhanTichYNghia, as: "phan_tich_y_nghia" }],
      });
      expect(loaded.phan_tich_y_nghia.ma_y_dinh).toBe(pt.ma_y_dinh);
    });
  });
});
