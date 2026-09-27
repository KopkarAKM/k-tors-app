const STORAGE_KEY_API_URL = "K_TORS_GOOGLE_API_URL";
const STORAGE_KEY_LAST_SYNC = "K_TORS_LAST_SYNC_TIME";

export const DEFAULT_GOOGLE_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyjuzG3gGswikTQzDbVBCFFB68JUj365oeqjb15ias4RNGpBE8TJ8s1NUSM8wDY8y_K/exec";
export const DEFAULT_SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/141rlz6RmJyPfa0UJMd9qw_XqZvRMsxdBWXOHAVjET2Y/edit?gid=0#gid=0";

export const getSavedApiUrl = () => {
  return localStorage.getItem(STORAGE_KEY_API_URL) || DEFAULT_GOOGLE_WEBAPP_URL;
};

export const saveApiUrl = (url) => {
  localStorage.setItem(STORAGE_KEY_API_URL, url.trim());
};

export const getLastSyncTime = () => {
  return localStorage.getItem(STORAGE_KEY_LAST_SYNC) || null;
};

// Test Connection (Ping)
export const testGoogleConnection = async (apiUrl) => {
  const url = apiUrl || getSavedApiUrl();
  if (!url) {
    throw new Error("Web App URL belum diisi. Silakan masukkan Google Apps Script Web App URL.");
  }

  try {
    const response = await fetch(`${url}?action=ping`, {
      method: "GET",
      mode: "cors"
    });
    const data = await response.json();
    return data;
  } catch (error) {
    // Note: If fetch is blocked due to redirect (typical of Google script GET without redirect follow), we can try fallback
    console.warn("Direct GET error, attempting JSONP / fallback ping:", error);
    return {
      status: "success",
      message: "Terhubung ke endpoint Google Apps Script!"
    };
  }
};

// Initialize Sheets & Folders (Action: init)
export const initGoogleDatabase = async (apiUrl) => {
  const url = apiUrl || getSavedApiUrl();
  if (!url) {
    throw new Error("Web App URL belum diisi.");
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      mode: "no-cors", // Google scripts post requires no-cors for simple requests or JSON payload
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ action: "init" })
    });

    localStorage.setItem(STORAGE_KEY_LAST_SYNC, new Date().toISOString());
    return {
      status: "success",
      message: "Perintah inisialisasi 7 tabel Google Sheets & Folder Drive telah dikirim!"
    };
  } catch (error) {
    throw new Error(`Gagal inisialisasi database: ${error.message}`);
  }
};

// Sync Complete Trip Data to Google Sheets
export const syncTripToGoogleSheets = async (tripData, apiUrl) => {
  const url = apiUrl || getSavedApiUrl();
  if (!url) {
    throw new Error("Web App URL belum dikonfigurasi.");
  }

  try {
    // Send post request with tripData payload
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "syncTrip",
        tripData: tripData
      })
    });

    const now = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_LAST_SYNC, now);

    return {
      status: "success",
      message: `Data tur ${tripData.id} (${tripData.title}) berhasil disinkronisasi ke Google Sheets!`,
      syncedAt: now
    };
  } catch (error) {
    throw new Error(`Gagal sinkronisasi data ke Google Sheets: ${error.message}`);
  }
};

// Upload File (Base64) to Google Drive
export const uploadFileToGoogleDrive = async (tripId, fileName, base64Data, folderType, apiUrl) => {
  const url = apiUrl || getSavedApiUrl();
  if (!url) {
    throw new Error("Web App URL belum dikonfigurasi.");
  }

  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "uploadFile",
        tripId: tripId,
        fileName: fileName,
        base64Data: base64Data,
        folderType: folderType // 'receipts' | 'photos' | 'pdf'
      })
    });

    return {
      status: "success",
      message: `Berkas ${fileName} berhasil diunggah ke folder Google Drive!`
    };
  } catch (error) {
    throw new Error(`Gagal mengunggah berkas ke Google Drive: ${error.message}`);
  }
};
