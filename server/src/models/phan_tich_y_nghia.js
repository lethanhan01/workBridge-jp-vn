"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class PhanTichYNghia extends Model {
        static associate(models) {
            // Quan hệ n-1 với bảng tinnhan (Nhiều phân tích ý nghĩa thuộc về 1 tin nhắn)
            PhanTichYNghia.belongsTo(models.TinNhan, {
                foreignKey: "ma_tin_nhan",
                as: "tin_nhan",
            });

            // Quan hệ 1-n với bảng goi_y (1 phân tích ý nghĩa có nhiều gợi ý)
            PhanTichYNghia.hasMany(models.GoiY, {
                foreignKey: "ma_y_dinh",
                as: "danh_sach_goi_y",
            });
        }
    }

    PhanTichYNghia.init(
        {
            ma_y_dinh: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            ma_tin_nhan: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            sac_thai: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            tom_tat_y_dinh: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "PhanTichYNghia",
            tableName: "phan_tich_y_nghia",
            timestamps: false,
        }
    );

    return PhanTichYNghia;
};