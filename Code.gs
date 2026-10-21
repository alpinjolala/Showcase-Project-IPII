/**
 * BACKEND GAS UNTUK SISTEM IPII SHOWCASE
 * Deploy sebagai "Web App" dengan akses "Anyone" (Siapa saja).
 */

// =========================================================================
// 1. SETUP DATABASE (JALANKAN SEKALI DARI EDITOR SCRIPT)
// =========================================================================
function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Sheet Users
  let shUsers = ss.getSheetByName("Users");
  if (!shUsers) {
    shUsers = ss.insertSheet("Users");
    shUsers.appendRow(["ID_User", "Username", "Password", "Role", "Nama_Lengkap", "NIM"]);
    // Buat akun admin default sesuai instruksi (admin / admin2026)
    shUsers.appendRow(["U_ADMIN", "admin", "admin2026", "Admin", "Administrator Utama", "-"]);
    shUsers.getRange("1:1").setFontWeight("bold").setBackground("#D9EAD3");
  }

  // Sheet Karya
  let shKarya = ss.getSheetByName("Karya");
  if (!shKarya) {
    shKarya = ss.insertSheet("Karya");
    shKarya.appendRow(["ID_Karya", "NIM_Pembuat", "Nama_Pembuat", "Judul", "Kategori", "Deskripsi", "Link_Gambar", "Link_Eksternal", "Tanggal", "Status"]);
    shKarya.getRange("1:1").setFontWeight("bold").setBackground("#C9DAF8");
  }

  // Sheet Settings
  let shSettings = ss.getSheetByName("Settings");
  if (!shSettings) {
    shSettings = ss.insertSheet("Settings");
    shSettings.appendRow(["Pengaturan", "Nilai"]);
    // Default setting ID YouTube (contoh)
    shSettings.appendRow(["YT_PROFILE", "dQw4w9WgXcQ"]);
    // Default list Kategori
    shSettings.appendRow(["KATEGORI_LIST", "Proyek,Makalah,Kegiatan"]);
    shSettings.getRange("1:1").setFontWeight("bold").setBackground("#FFF2CC");
  }

  Logger.log("Setup Database Berhasil!");
}

// =========================================================================
// 2. ENTRY POINT API (POST METHOD) UNTUK BLOGGER FRONTEND
// =========================================================================
function doPost(e) {
  // CORS Headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Content-Type": "application/json"
  };

  try {
    const request = JSON.parse(e.postData.contents);
    const action = request.action;
    const payload = request.payload || {};
    
    let result = { success: false, message: "Aksi tidak ditemukan" };

    if (action === "login") result = apiLogin(payload);
    else if (action === "getPublicData") result = apiGetPublicData();
    else if (action === "getAdminData") result = apiGetAdminData();
    else if (action === "getMahasiswaData") result = apiGetMahasiswaData(payload);
    else if (action === "saveKarya") result = apiSaveKarya(payload);
    else if (action === "deleteKarya") result = apiDeleteKarya(payload);
    else if (action === "saveUser") result = apiSaveUser(payload);
    else if (action === "deleteUser") result = apiDeleteUser(payload);
    else if (action === "saveSettings") result = apiSaveSettings(payload);

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Handler khusus preflight CORS (Browser kadang butuh ini)
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// =========================================================================
// 3. LOGIKA API (FUNGSI-FUNGSI UTAMA)
// =========================================================================

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function getSheet(sheetName) {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
}

// Format Data Utility
function sheetToJson(sheet) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const result = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    let obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    // inject row index untuk mempermudah update/delete
    obj._rowIndex = i + 1;
    result.push(obj);
  }
  return result;
}

// API Functions
function apiLogin(payload) {
  const users = sheetToJson(getSheet("Users"));
  const user = users.find(u => u.Username == payload.username && u.Password == payload.password);
  
  if (user) {
    return {
      success: true,
      user: {
        id: user.ID_User,
        username: user.Username,
        role: user.Role,
        nama: user.Nama_Lengkap,
        nim: user.NIM
      }
    };
  }
  return { success: false, message: "Username atau password salah!" };
}

function apiGetPublicData() {
  const allKarya = sheetToJson(getSheet("Karya"));
  const settings = sheetToJson(getSheet("Settings"));
  
  // Format Data
  const karyaData = allKarya
    .filter(k => k.Status === "Approved")
    .map(k => ({
      id: k.ID_Karya, nim: k.NIM_Pembuat, nama: k.Nama_Pembuat,
      judul: k.Judul, kategori: k.Kategori, desc: k.Deskripsi,
      img: k.Link_Gambar, link: k.Link_Eksternal, tanggal: k.Tanggal, status: k.Status
    }));

  let settingsObj = {};
  settings.forEach(s => settingsObj[s.Pengaturan] = s.Nilai);

  return { success: true, karya: karyaData, settings: settingsObj };
}

function apiGetAdminData() {
  const allKarya = sheetToJson(getSheet("Karya"));
  const allUsers = sheetToJson(getSheet("Users"));
  const settings = sheetToJson(getSheet("Settings"));

  const karyaData = allKarya.map(k => ({
    id: k.ID_Karya, nim: k.NIM_Pembuat, nama: k.Nama_Pembuat,
    judul: k.Judul, kategori: k.Kategori, desc: k.Deskripsi,
    img: k.Link_Gambar, link: k.Link_Eksternal, tanggal: k.Tanggal, status: k.Status
  }));

  const userData = allUsers.map(u => ({
    id: u.ID_User, username: u.Username, role: u.Role,
    nama: u.Nama_Lengkap, nim: u.NIM
  }));

  let settingsObj = {};
  settings.forEach(s => settingsObj[s.Pengaturan] = s.Nilai);

  return { success: true, karya: karyaData, users: userData, settings: settingsObj };
}

function apiGetMahasiswaData(payload) {
  const allKarya = sheetToJson(getSheet("Karya"));
  const karyaData = allKarya
    .filter(k => k.NIM_Pembuat == payload.nim)
    .map(k => ({
      id: k.ID_Karya, nim: k.NIM_Pembuat, nama: k.Nama_Pembuat,
      judul: k.Judul, kategori: k.Kategori, desc: k.Deskripsi,
      img: k.Link_Gambar, link: k.Link_Eksternal, tanggal: k.Tanggal, status: k.Status
    }));

  return { success: true, karya: karyaData };
}

function apiSaveKarya(payload) {
  const sheet = getSheet("Karya");
  
  if (payload.id) {
    // Mode Update
    const all = sheetToJson(sheet);
    const rowObj = all.find(k => k.ID_Karya == payload.id);
    if (rowObj) {
      // Urutan Header: ID_Karya, NIM_Pembuat, Nama_Pembuat, Judul, Kategori, Deskripsi, Link_Gambar, Link_Eksternal, Tanggal, Status
      const row = rowObj._rowIndex;
      sheet.getRange(row, 4).setValue(payload.judul);
      sheet.getRange(row, 5).setValue(payload.kategori);
      sheet.getRange(row, 6).setValue(payload.desc);
      sheet.getRange(row, 7).setValue(payload.img);
      sheet.getRange(row, 8).setValue(payload.link);
      sheet.getRange(row, 9).setValue(payload.tanggal); // Update Tanggal manual
      sheet.getRange(row, 10).setValue(payload.status);
    }
  } else {
    // Mode Insert
    const newId = "K" + new Date().getTime();
    sheet.appendRow([
      newId, payload.nim, payload.nama, payload.judul, payload.kategori, 
      payload.desc, payload.img, payload.link, payload.tanggal, payload.status
    ]);
  }
  return { success: true };
}

function apiDeleteKarya(payload) {
  const sheet = getSheet("Karya");
  const all = sheetToJson(sheet);
  const rowObj = all.find(k => k.ID_Karya == payload.id);
  
  if (rowObj) {
    sheet.deleteRow(rowObj._rowIndex);
    return { success: true };
  }
  return { success: false, message: "Data tidak ditemukan" };
}

function apiSaveUser(payload) {
  const sheet = getSheet("Users");
  const newId = "U" + new Date().getTime();
  // ID_User, Username, Password, Role, Nama_Lengkap, NIM
  sheet.appendRow([newId, payload.username, payload.password, "Mahasiswa", payload.nama, payload.nim]);
  return { success: true };
}

function apiDeleteUser(payload) {
  const sheet = getSheet("Users");
  const all = sheetToJson(sheet);
  const rowObj = all.find(u => u.ID_User == payload.id);
  
  if (rowObj) {
    sheet.deleteRow(rowObj._rowIndex);
    return { success: true };
  }
  return { success: false, message: "Data tidak ditemukan" };
}

function apiSaveSettings(payload) {
  const sheet = getSheet("Settings");
  const all = sheetToJson(sheet);
  
  // Simpan Youtube ID
  let rowObjYT = all.find(s => s.Pengaturan == "YT_PROFILE");
  if (rowObjYT) {
    sheet.getRange(rowObjYT._rowIndex, 2).setValue(payload.yt_id);
  } else {
    sheet.appendRow(["YT_PROFILE", payload.yt_id]);
  }

  // Simpan Daftar Kategori
  if (payload.kategori_list !== undefined) {
    let rowObjKat = all.find(s => s.Pengaturan == "KATEGORI_LIST");
    if (rowObjKat) {
      sheet.getRange(rowObjKat._rowIndex, 2).setValue(payload.kategori_list);
    } else {
      sheet.appendRow(["KATEGORI_LIST", payload.kategori_list]);
    }
  }
  
  return { success: true };
}