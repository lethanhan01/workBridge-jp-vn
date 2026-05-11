"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class NguoiDung extends Model {
        static associate(models) {
            // 1. Quan hệ n-1 với bảng vai_tro
            NguoiDung.belongsTo(models.VaiTro, {
                foreignKey: "ma_vai_tro",
                as: "vai_tro",
            });

            // 2. Quan hệ n-n với bảng tu_chuyen_nganh (thông qua bảng trung gian)
            NguoiDung.belongsToMany(models.TuChuyenNganh, {
                through: "nguoi_dung_yeu_thich_tu", 
                foreignKey: "ma_nguoi_dung",
                otherKey: "ma_tu",
                as: "danh_sach_tu_yeu_thich",
            });

            // 3. Quan hệ n-n với bảng cuoc_hoi_thoai (thông qua bảng thanhvienhoithoai)
            NguoiDung.belongsToMany(models.CuocHoiThoai, {
                through: models.ThanhVienHoiThoai, 
                foreignKey: "ma_nguoi_dung",
                otherKey: "ma_cuoc_hoi_thoai",
                as: "danh_sach_cuoc_hoi_thoai",
            });

            // 4. Quan hệ 1-n với bảng thanhvienhoithoai (Để truy vấn trực tiếp lịch sử tham gia)
            NguoiDung.hasMany(models.ThanhVienHoiThoai, {
                foreignKey: "ma_nguoi_dung",
                as: "chi_tiet_tham_gia",
            });

            // 5. Quan hệ 1-n với bảng tinnhan (Một người gửi nhiều tin nhắn)
            NguoiDung.hasMany(models.TinNhan, {
                foreignKey: "ma_nguoi_gui",
                as: "danh_sach_tin_nhan",
            });
        }
    }

    NguoiDung.init(
        {
            ma_nguoi_dung: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            ma_vai_tro: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            ten_dang_nhap: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            matkhau: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            ten: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "NguoiDung",
            tableName: "nguoi_dung",
            timestamps: false,
        }
    );

    return NguoiDung;
};