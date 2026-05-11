"use strict";

import { isSupabaseConfigured, supabase } from "../db/supabase.js";

/**
 * @param {object} row
 * @param {string} row.ma_cuoc_hoi_thoai
 * @param {string} row.ma_nguoi_gui
 * @param {string} [row.noi_dung]
 * @param {string} [row.trang_thai]
 */
export async function insertTinNhan(row) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase chưa cấu hình");
  }

  const { data, error } = await supabase
    .from("tinnhan")
    .insert({
      ma_cuoc_hoi_thoai: row.ma_cuoc_hoi_thoai,
      ma_nguoi_gui: row.ma_nguoi_gui,
      noi_dung: row.noi_dung ?? null,
      trang_thai: row.trang_thai ?? null,
    })
    .select("ma_tin_nhan, ma_cuoc_hoi_thoai, ma_nguoi_gui, noi_dung, trang_thai, time")
    .single();

  if (error) {
    throw error;
  }
  return data;
}
