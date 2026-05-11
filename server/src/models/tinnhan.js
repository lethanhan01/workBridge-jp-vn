"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class TinNhan extends Model {
        static associate(models) {
            // 1. Quan hệ n-1 với bảng cuoc_hoi_thoai (Nhiều tin nhắn thuộc về 1 cuộc hội thoại)
            TinNhan.belongsTo(models.CuocHoiThoai, {
                foreignKey: "ma_cuoc_hoi_thoai",
                as: "cuoc_hoi_thoai",
            });

            // 2. Quan hệ n-1 với bảng nguoi_dung (Nhiều tin nhắn được gửi bởi 1 người dùng)
            TinNhan.belongsTo(models.NguoiDung, {
                foreignKey: "ma_nguoi_gui",
                as: "nguoi_gui",
            });

            // 3. Quan hệ 1-1 với bảng bandich (1 tin nhắn có 1 bản dịch)
            TinNhan.hasOne(models.BanDich, {
                foreignKey: "ma_tin_nhan",
                as: "ban_dich",
            });

            // 4. Quan hệ 1-n với bảng phan_tich_y_nghia (1 tin nhắn có thể có nhiều phân tích ý nghĩa)
            TinNhan.hasMany(models.PhanTichYNghia, {
                foreignKey: "ma_tin_nhan",
                as: "danh_sach_phan_tich",
            });
        }
    }

    TinNhan.init(
        {
            ma_tin_nhan: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            ma_cuoc_hoi_thoai: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            ma_nguoi_gui: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            noi_dung: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            trang_thai: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            time: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "TinNhan",
            tableName: "tinnhan",
            timestamps: false,
        }
    );

    return TinNhan;
};