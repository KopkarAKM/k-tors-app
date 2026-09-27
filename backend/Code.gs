/**
 * K-TORS (Kopkarindo Digital Tour Operations & Reporting System)
 * Google Apps Script Backend API (Google Sheets as Database & Google Drive as File Storage)
 * 
 * Petunjuk Deployment:
 * 1. Buat Google Spreadsheet baru di https://sheets.new
 * 2. Klik menu 'Extensions' (Ekstensi) -> 'Apps Script'
 * 3. Hapus kode bawaan, lalu paste SELURUH kode di bawah ini.
 * 4. Klik menu 'Deploy' (Terapkan) -> 'New deployment' (Penerapan baru)
 * 5. Pilih tipe: 'Web app'
 *    - Description: K-TORS Backend API
 *    - Execute as: 'Me' (Email Anda)
 *    - Who has access: 'Anyone' (Siapa saja, termasuk anonim)
 * 6. Klik 'Deploy', izinkan otorisasi akun Google (Pilih Advanced -> Go to K-TORS -> Allow).
 * 7. Salin 'Web App URL' (cth: https://script.google.com/macros/s/.../exec) dan masukkan ke K-TORS Web App.
 */

// ==========================================
// 1. INITIALIZATION: CREATE DATABASE & FOLDERS
// ==========================================
function initDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Tab Trips
  setupSheet(ss, "1_TRIPS", [
    "Trip_ID", "SPT_Number", "Title", "Destination", "Type", 
    "StartDate", "EndDate", "Status", "Lead_TL_Name", "Lead_TL_BNSP", 
    "Co_TL_Name", "Ops_Manager", "Finance_Officer", "Drive_Folder_URL", "Last_Updated"
  ]);

  // 2. Tab Passengers (Manifest & Medical)
  setupSheet(ss, "2_PASSENGERS", [
    "Trip_ID", "Pax_ID", "Name", "Gender", "DocType", "DocNo", 
    "ExpiryDate", "Nationality", "DOB", "Phone", "WhatsApp_Number",
    "Emergency_Contact_Name", "Emergency_Contact_WA", "Medical_History",
    "Allergy_Diet", "Food_Restrictions", "Required_Medicines", "Special_Notes",
    "MDAC_Status", "RoomNo", "SeatNo", "Present_CGK", 
    "Present_KUL", "Present_Hotel", "Present_Bus", "Present_Return", "Last_Updated"
  ]);

  // 3. Tab Ramp Check (FM-K3-01)
  setupSheet(ss, "3_RAMP_CHECK", [
    "Trip_ID", "Form_Number", "Inspection_Date", "Location", "Vehicle_Plate", 
    "Driver_Name", "Odometer_KM", "Brakes", "Tires", "Seatbelts", "APAR", 
    "P3K_Box", "Emergency_Exits", "Lights_Horn", "Vehicle_Docs", "Driver_Health", 
    "Overall_Conclusion", "Driver_Signed", "TL_Signed", "Last_Updated"
  ]);

  // 4. Tab Daily Logs (Jurnal & Safety Briefing)
  setupSheet(ss, "4_DAILY_LOGS", [
    "Trip_ID", "Log_ID", "Day_Title", "Time", "Location", "GPS_Coordinates", 
    "Activity_Description", "Safety_Topic", "Assembly_Point", "Headcount_Present", 
    "Headcount_Total", "Photo_Drive_URL", "Notes", "Timestamp"
  ]);

  // 5. Tab Incidents (FM-K3-04)
  setupSheet(ss, "5_INCIDENTS", [
    "Trip_ID", "Incident_ID", "Form_Number", "Date", "Time", "Location", 
    "Category", "Passenger_Name", "Severity", "Description", "Action_Taken", 
    "Status", "Officer_Signed", "Timestamp"
  ]);

  // 6. Tab Expenses (Settlement Keuangan)
  setupSheet(ss, "6_EXPENSES", [
    "Trip_ID", "Expense_ID", "Date", "Category", "Description", 
    "Amount_IDR", "Receipt_Proof_No", "Receipt_Drive_URL", "Timestamp"
  ]);

  // 7. Tab CSAT (Evaluasi Kepuasan)
  setupSheet(ss, "7_CSAT_EVALUATION", [
    "Trip_ID", "Respondent_Name", "Rating_Stars", "Review_Comment", "Timestamp"
  ]);

  // Create Parent Folder in Google Drive
  const parentFolder = getOrCreateDriveFolder("K-TORS_Cloud_Storage");

  return {
    status: "success",
    message: "Database Google Sheets & Google Drive Folder berhasil diinisialisasi!",
    spreadsheetUrl: ss.getUrl(),
    driveFolderUrl: parentFolder.getUrl()
  };
}

function setupSheet(ss, sheetName, headers) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  // Setup Header styling
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground("#0f172a")
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setFontFamily("Arial");
  sheet.setFrozenRows(1);
}

function getOrCreateDriveFolder(folderName, parent) {
  const iterator = parent ? parent.getFoldersByName(folderName) : DriveApp.getFoldersByName(folderName);
  if (iterator.hasNext()) {
    return iterator.next();
  }
  return parent ? parent.createFolder(folderName) : DriveApp.createFolder(folderName);
}

// ==========================================
// 2. REST API HANDLER (doGet & doPost)
// ==========================================
function doGet(e) {
  const action = e.parameter.action;
  
  if (action === "init") {
    const result = initDatabase();
    return createJsonResponse(result);
  }
  
  if (action === "ping") {
    return createJsonResponse({
      status: "success",
      message: "K-TORS Google Backend API Online!",
      timestamp: new Date().toISOString()
    });
  }

  if (action === "getTrip") {
    const tripId = e.parameter.tripId || "TRIP-2026-MY-088";
    const data = getTripFromSheets(tripId);
    return createJsonResponse(data);
  }

  return createJsonResponse({
    status: "ready",
    message: "K-TORS Apps Script REST API is active.",
    availableActions: ["init", "ping", "getTrip", "syncTripData", "uploadFile"]
  });
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;

    if (action === "syncTrip") {
      const result = syncTripToSheets(postData.tripData);
      return createJsonResponse(result);
    }

    if (action === "uploadFile") {
      const result = uploadFileToDrive(postData.tripId, postData.fileName, postData.base64Data, postData.folderType);
      return createJsonResponse(result);
    }

    if (action === "init") {
      const result = initDatabase();
      return createJsonResponse(result);
    }

    return createJsonResponse({ status: "error", message: "Action tidak dikenal: " + action });
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

// ==========================================
// 3. SYNCHRONIZE TRIP DATA TO SHEETS
// ==========================================
function syncTripToSheets(trip) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Sync Trip Meta
  const tripSheet = ss.getSheetByName("1_TRIPS");
  const tripRow = [
    trip.id, trip.sptNumber, trip.title, trip.destination, trip.type,
    trip.startDate, trip.endDate, trip.status, trip.staff.leadTL.name,
    trip.staff.leadTL.noRegBnsp, trip.staff.coTL.name, trip.staff.opsManager.name,
    trip.staff.financeOfficer.name, "", new Date().toISOString()
  ];
  updateOrInsertRow(tripSheet, 1, trip.id, tripRow);

  // 2. Sync Passengers
  const paxSheet = ss.getSheetByName("2_PASSENGERS");
  if (trip.passengers && trip.passengers.length > 0) {
    trip.passengers.forEach(p => {
      const paxRow = [
        trip.id, p.id, p.name, p.gender, p.docType, p.docNo,
        p.expiryDate, p.nationality, p.dob, p.phone, p.waPhone || p.phone,
        p.emergencyContactName || p.emergencyContact || "-", p.emergencyContactWa || "-",
        p.medicalHistory || "Tidak Ada", p.allergy || "Tidak Ada",
        p.foodRestrictions || "Tidak Ada", p.requiredMedicines || "Tidak Ada",
        p.specialNotes || "", p.mdacStatus, p.roomNo, p.seatNo,
        p.attendance?.departureCGK ? "HADIR" : "TIDAK",
        p.attendance?.arrivalKUL ? "HADIR" : "TIDAK",
        p.attendance?.hotelCheckin ? "HADIR" : "TIDAK",
        p.attendance?.busTour ? "HADIR" : "TIDAK",
        p.attendance?.returnCGK ? "HADIR" : "TIDAK",
        new Date().toISOString()
      ];
      updateOrInsertRow(paxSheet, 2, p.id, paxRow);
    });
  }

  // 3. Sync Ramp Check
  if (trip.rampCheck) {
    const rcSheet = ss.getSheetByName("3_RAMP_CHECK");
    const rcItems = {};
    (trip.rampCheck.items || []).forEach(item => {
      rcItems[item.id] = item.status;
    });

    const rcRow = [
      trip.id, trip.rampCheck.formNumber, trip.rampCheck.inspectionDate,
      trip.rampCheck.location, trip.rampCheck.vehiclePlate, trip.rampCheck.driverName,
      trip.rampCheck.odometerKm, rcItems["rc-1"] || "LAIK", rcItems["rc-2"] || "LAIK",
      rcItems["rc-3"] || "LAIK", rcItems["rc-4"] || "LAIK", rcItems["rc-5"] || "LAIK",
      rcItems["rc-6"] || "LAIK", rcItems["rc-7"] || "LAIK", rcItems["rc-8"] || "LAIK",
      rcItems["rc-9"] || "LAIK", trip.rampCheck.overallConclusion, "YES", "YES", new Date().toISOString()
    ];
    updateOrInsertRow(rcSheet, 1, trip.id, rcRow);
  }

  // 4. Sync Daily Logs
  const logSheet = ss.getSheetByName("4_DAILY_LOGS");
  if (trip.dailyLogs && trip.dailyLogs.length > 0) {
    trip.dailyLogs.forEach(log => {
      const logRow = [
        trip.id, log.id, log.day, log.time, log.location, log.gps,
        log.activity, log.safetyBriefing?.topic || "", log.safetyBriefing?.assemblyPoint || "",
        log.safetyBriefing?.headcountPresent || 12, log.safetyBriefing?.headcountTotal || 12,
        log.image || "", log.notes || "", new Date().toISOString()
      ];
      updateOrInsertRow(logSheet, 2, log.id, logRow);
    });
  }

  // 5. Sync Incidents
  const incSheet = ss.getSheetByName("5_INCIDENTS");
  if (trip.incidents && trip.incidents.length > 0) {
    trip.incidents.forEach(inc => {
      const incRow = [
        trip.id, inc.id, inc.formNumber, inc.date, inc.time, inc.location,
        inc.category, inc.passengerName, inc.severity, inc.description,
        inc.actionTaken, inc.status, "YES", new Date().toISOString()
      ];
      updateOrInsertRow(incSheet, 2, inc.id, incRow);
    });
  }

  // 6. Sync Expenses
  const expSheet = ss.getSheetByName("6_EXPENSES");
  if (trip.finance && trip.finance.expenses) {
    trip.finance.expenses.forEach(exp => {
      const expRow = [
        trip.id, exp.id, exp.date, exp.category, exp.description,
        exp.amount, exp.receiptProof, "", new Date().toISOString()
      ];
      updateOrInsertRow(expSheet, 2, exp.id, expRow);
    });
  }

  // 7. Sync CSAT
  const csatSheet = ss.getSheetByName("7_CSAT_EVALUATION");
  if (trip.csat && trip.csat.guestComments) {
    trip.csat.guestComments.forEach((c, idx) => {
      const csatRow = [
        trip.id, c.name, c.rating, c.comment, new Date().toISOString()
      ];
      updateOrInsertRow(csatSheet, 2, `${trip.id}_${c.name}`, csatRow);
    });
  }

  return {
    status: "success",
    message: `Data tur ${trip.id} (${trip.title}) berhasil disinkronisasi ke 7 Sheet Google Spreadsheet!`,
    syncedAt: new Date().toISOString()
  };
}

// ==========================================
// 4. UPLOAD FILES (NOTA/FOTO/PDF) TO GOOGLE DRIVE
// ==========================================
function uploadFileToDrive(tripId, fileName, base64Data, folderType) {
  const rootFolder = getOrCreateDriveFolder("K-TORS_Cloud_Storage");
  const tripFolder = getOrCreateDriveFolder(tripId || "TRIP_DOCS", rootFolder);
  
  let targetFolder = tripFolder;
  if (folderType === "receipts") {
    targetFolder = getOrCreateDriveFolder("1_Nota_Kuitansi", tripFolder);
  } else if (folderType === "photos") {
    targetFolder = getOrCreateDriveFolder("2_Foto_Jurnal_GPS", tripFolder);
  } else if (folderType === "pdf") {
    targetFolder = getOrCreateDriveFolder("3_Dokumen_PDF_BNSP", tripFolder);
  }

  // Decode base64
  const decodedData = Utilities.base64Decode(base64Data);
  let contentType = "application/octet-stream";
  if (fileName.endsWith(".pdf")) contentType = "application/pdf";
  else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) contentType = "image/jpeg";
  else if (fileName.endsWith(".png")) contentType = "image/png";

  const blob = Utilities.newBlob(decodedData, contentType, fileName);
  const file = targetFolder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return {
    status: "success",
    fileId: file.getId(),
    fileName: file.getName(),
    fileUrl: file.getUrl(),
    downloadUrl: file.getDownloadUrl(),
    folderName: targetFolder.getName()
  };
}

// Helper: Update row if key exists, otherwise append
function updateOrInsertRow(sheet, keyColumnIndex, keyValue, rowData) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    sheet.appendRow(rowData);
    return;
  }

  const values = sheet.getRange(2, keyColumnIndex, lastRow - 1, 1).getValues();
  for (let i = 0; i < values.length; i++) {
    if (values[i][0] == keyValue) {
      sheet.getRange(i + 2, 1, 1, rowData.length).setValues([rowData]);
      return;
    }
  }
  sheet.appendRow(rowData);
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
