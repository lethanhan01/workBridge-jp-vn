"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class GoiY extends Model {
        static associate(models) {
            // Quan hệ n-1 với bảng phan_tich_y_nghia (Nhiều gợi ý thuộc về 1 phân tích ý định)
            GoiY.belongsTo(models.PhanTichYNghia, {
                foreignKey: "ma_y_dinh",
                as: "phan_tich_y_nghia",
            });
        }
    }

    GoiY.init(
        {
            ma_goi_y: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            ma_y_dinh: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            noi_dung_tieng_viet: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            noi_dung_tieng_nhat: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            muc_do_phu_hop: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "GoiY",
            tableName: "goi_y",
            timestamps: false,
        }
    );

    return GoiY;
};