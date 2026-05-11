"use strict";

import { Sequelize, DataTypes } from "sequelize";

import banDichFactory from "../../src/models/bandich.js";
import cuocHoiThoaiFactory from "../../src/models/cuoc_hoi_thoai.js";
import goiYFactory from "../../src/models/goi_y.js";
import nguoiDungFactory from "../../src/models/nguoi_dung.js";
import phanTichYNghiaFactory from "../../src/models/phan_tich_y_nghia.js";
import thanhVienHoiThoaiFactory from "../../src/models/thanhvienhoithoai.js";
import tinNhanFactory from "../../src/models/tinnhan.js";
import tuChuyenNganhFactory from "../../src/models/tu_chuyen_nganh.js";
import vaiTroFactory from "../../src/models/vai_tro.js";

export async function createTestDb() {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });

  const db = {};
  db.VaiTro = vaiTroFactory(sequelize, DataTypes);
  db.NguoiDung = nguoiDungFactory(sequelize, DataTypes);
  db.TuChuyenNganh = tuChuyenNganhFactory(sequelize, DataTypes);
  db.CuocHoiThoai = cuocHoiThoaiFactory(sequelize, DataTypes);
  db.ThanhVienHoiThoai = thanhVienHoiThoaiFactory(sequelize, DataTypes);
  db.TinNhan = tinNhanFactory(sequelize, DataTypes);
  db.BanDich = banDichFactory(sequelize, DataTypes);
  db.PhanTichYNghia = phanTichYNghiaFactory(sequelize, DataTypes);
  db.GoiY = goiYFactory(sequelize, DataTypes);

  Object.values(db).forEach((model) => {
    if (typeof model.associate === "function") {
      model.associate(db);
    }
  });

  await sequelize.sync({ force: true });
  return { sequelize, ...db };
}
