"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class TuChuyenNganh extends Model {
        static associate(models) {
            // Quan hệ n-n với bảng nguoi_dung thông qua bảng trung gian nguoi_dung_yeu_thich_tu
            TuChuyenNganh.belongsToMany(models.NguoiDung, {
                through: "nguoi_dung_yeu_thich_tu",
                foreignKey: "ma_tu",
                otherKey: "ma_nguoi_dung",
                as: "danh_sach_nguoi_dung_yeu_thich",
            });
        }
    }

    TuChuyenNganh.init(
        {
            ma_tu: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            chuyen_nganh: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            thuat_ngu_tieng_viet: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            thuat_ngu_tieng_nhat: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            giai_thich_ngu_tieng_viet: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            giai_thich_tieng_nhat: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            vi_du_tieng_viet: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            vi_du_tieng_nhat: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "TuChuyenNganh",
            tableName: "tu_chuyen_nganh",
            timestamps: false,
        }
    );

    return TuChuyenNganh;
};