"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class BanDich extends Model {
        static associate(models) {
            // Quan hệ 1-1 với bảng tinnhan (Bản dịch thuộc về 1 tin nhắn)
            BanDich.belongsTo(models.TinNhan, {
                foreignKey: "ma_tin_nhan",
                as: "tin_nhan",
            });
        }
    }

    BanDich.init(
        {
            ma_ban_dich: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            ma_tin_nhan: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            noidungoc: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            noi_dung_da_dich: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "BanDich",
            tableName: "bandich",
            timestamps: false,
        }
    );

    return BanDich;
};