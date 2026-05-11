"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class CuocHoiThoai extends Model {
        static associate(models) {
            // Quan hệ 1-n với bảng thanhvienhoithoai (1 cuộc hội thoại có nhiều thành viên)
            CuocHoiThoai.hasMany(models.ThanhVienHoiThoai, {
                foreignKey: "ma_cuoc_hoi_thoai",
                as: "danh_sach_thanh_vien",
            });

            // Quan hệ n-n với bảng nguoi_dung thông qua bảng trung gian thanhvienhoithoai
            CuocHoiThoai.belongsToMany(models.NguoiDung, {
                through: models.ThanhVienHoiThoai,
                foreignKey: "ma_cuoc_hoi_thoai",
                otherKey: "ma_nguoi_dung",
                as: "nguoi_dung_tham_gia",
            });

            // Quan hệ 1-n với bảng tinnhan (1 cuộc hội thoại có nhiều tin nhắn)
            CuocHoiThoai.hasMany(models.TinNhan, {
                foreignKey: "ma_cuoc_hoi_thoai",
                as: "danh_sach_tin_nhan",
            });
        }
    }

    CuocHoiThoai.init(
        {
            ma_cuoc_hoi_thoai: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            ten_cuoc_hoi_thoai: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            ngay_tao: {
                type: DataTypes.DATE, // Sequelize sử dụng DATE để ánh xạ với TIMESTAMP WITH TIME ZONE
                defaultValue: DataTypes.NOW, // Tương đương DEFAULT NOW()
            },
        },
        {
            sequelize,
            modelName: "CuocHoiThoai",
            tableName: "cuoc_hoi_thoai",
            timestamps: false, // Sử dụng trường ngay_tao tự định nghĩa thay vì created_at, updated_at mặc định
        }
    );

    return CuocHoiThoai;
};