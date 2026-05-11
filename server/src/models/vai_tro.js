"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class VaiTro extends Model {
        static associate(models) {
            // Một vai trò có nhiều người dùng (Quan hệ 1-N)
            VaiTro.hasMany(models.NguoiDung, {
                foreignKey: "ma_vai_tro",
                as: "danh_sach_nguoi_dung", 
            });
        }
    }

    VaiTro.init(
        {
            ma_vai_tro: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4, // Tương đương với gen_random_uuid() trong DB
                primaryKey: true,
            },
            ten_vai_tro: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "VaiTro",
            tableName: "vai_tro",
            timestamps: false, // Bảng vai_tro không có các cột ghi nhận thời gian (created_at, updated_at)
        }
    );
    
    return VaiTro;
};