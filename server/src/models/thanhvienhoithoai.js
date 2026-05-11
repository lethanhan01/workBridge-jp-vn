"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class ThanhVienHoiThoai extends Model {
        static associate(models) {
            // Quan hệ n-1 với bảng nguoi_dung (Nhiều bản ghi thành viên thuộc về 1 người dùng)
            ThanhVienHoiThoai.belongsTo(models.NguoiDung, {
                foreignKey: "ma_nguoi_dung",
                as: "nguoi_dung",
            });

            // Quan hệ n-1 với bảng cuoc_hoi_thoai (Nhiều bản ghi thành viên thuộc về 1 cuộc hội thoại)
            ThanhVienHoiThoai.belongsTo(models.CuocHoiThoai, {
                foreignKey: "ma_cuoc_hoi_thoai",
                as: "cuoc_hoi_thoai",
            });
        }
    }

    ThanhVienHoiThoai.init(
        {
            ma_thanh_vien: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            ma_cuoc_hoi_thoai: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            ma_nguoi_dung: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            ngay_tham_gia: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "ThanhVienHoiThoai",
            tableName: "thanhvienhoithoai",
            timestamps: false,
        }
    );

    return ThanhVienHoiThoai;
};