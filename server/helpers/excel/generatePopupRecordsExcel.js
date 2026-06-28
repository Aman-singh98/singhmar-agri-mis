

import ExcelJS from "exceljs";

function safe(v)  { return v != null && v !== "" ? v : "—"; }
function num2(v)  { return v != null && !isNaN(Number(v)) ? Number(Number(v).toFixed(2)) : "—"; }
function numIN(v) { return v != null && !isNaN(Number(v)) ? Math.round(Number(v)) : "—"; }
function today()  { return new Date().toLocaleDateString("en-IN"); }

function fmtDate(val) {
   if (!val) return "—";
   const d = new Date(val);
   if (isNaN(d.getTime())) return "—";
   return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
}

const COLUMNS = [
   { key: "srNo",                    label: "S.No",                  width: 7,  align: "center" },
   { key: "scanNo",                  label: "Scan No",               width: 14, align: "left"   },
   { key: "brandName",               label: "Brand",                 width: 14, align: "left"   },
   { key: "name",                    label: "Name",                  width: 22, align: "left"   },
   { key: "fatherName",              label: "Father Name",           width: 20, align: "left"   },
   { key: "mobileNo",                label: "Mobile No",             width: 14, align: "left"   },
   { key: "dealerName",              label: "Dealer",                width: 20, align: "left"   },
   { key: "farmerDealerCode",        label: "Dealer Code",           width: 14, align: "left"   },
   { key: "village",                 label: "Village",               width: 16, align: "left"   },
   { key: "block",                   label: "Block",                 width: 14, align: "left"   },
   { key: "district",                label: "District",              width: 14, align: "left"   },
   { key: "type",                    label: "Irrigation Type",       width: 14, align: "left"   },
   { key: "areaInAcre",              label: "Area (Acre)",           width: 12, align: "right", num: "acre" },
   { key: "miNumber",                label: "MI Number",             width: 16, align: "left"   },
   { key: "billNo",                  label: "Bill No",               width: 14, align: "left"   },
   { key: "billValue",               label: "Bill Value",            width: 14, align: "right", num: "int"  },
   { key: "gst",                     label: "GST",                   width: 12, align: "right", num: "int"  },
   { key: "farmerShare",             label: "Farmer Share",          width: 14, align: "right", num: "int"  },
   { key: "dateOfApplication",       label: "Date of Application",   width: 18, align: "center", date: true },
   { key: "verificationStatus",      label: "Verification Status",   width: 18, align: "left"   },
   { key: "estimateStatus",          label: "Estimate Status",       width: 16, align: "left"   },
   { key: "onlineFarmerShareStatus", label: "Farmer Share Status",   width: 18, align: "left"   },
   { key: "challanStatus",           label: "Challan Status",        width: 16, align: "left"   },
   { key: "tallyBillStatus",         label: "Tally Bill Status",     width: 16, align: "left"   },
   { key: "billUploadStatus",        label: "Bill Upload Status",    width: 16, align: "left"   },
   { key: "verificationDone",        label: "Verification Done",     width: 16, align: "left"   },
   { key: "applicationStatus",       label: "Application Status",    width: 18, align: "left"   },
   { key: "status",                  label: "MI Status",             width: 36, align: "left"   },
   { key: "delay",                   label: "Delay",                 width: 10, align: "center" },
   { key: "remarks",                 label: "Remarks",               width: 20, align: "left"   },
   { key: "reason",                  label: "Reason",                width: 20, align: "left"   },
];

// Proper Excel column-letter conversion (handles >26 columns, unlike
// String.fromCharCode(65 + n - 1), which breaks past column Z).
function colLetter(idx) {
   let letter = "";
   let n = idx + 1;
   while (n > 0) {
      const rem = (n - 1) % 26;
      letter = String.fromCharCode(65 + rem) + letter;
      n = Math.floor((n - 1) / 26);
   }
   return letter;
}

const LAST_COL = colLetter(COLUMNS.length - 1); // "AE" for 31 cols

export async function generatePopupRecordsExcel(data) {
   const { title = "Records", records = [] } = data;

   const wb = new ExcelJS.Workbook();
   wb.creator = "System";
   wb.created = new Date();

   const ws = wb.addWorksheet("Records");
   ws.columns = COLUMNS.map(c => ({ key: c.key, width: c.width }));

   // ── Title ──
   ws.mergeCells(`A1:${LAST_COL}1`);
   const t = ws.getCell("A1");
   t.value     = title;
   t.font      = { name: "Arial", bold: true, size: 13 };
   t.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(1).height = 26;

   // ── Meta line ──
   ws.mergeCells(`A2:${LAST_COL}2`);
   const m = ws.getCell("A2");
   m.value     = `Total Records: ${records.length}   |   Generated: ${today()}`;
   m.font      = { name: "Arial", size: 10, italic: true };
   m.alignment = { horizontal: "center", vertical: "middle" };
   ws.getRow(2).height = 16;

   // ── Header row ──
   const hr = ws.addRow(COLUMNS.map(c => c.label));
   hr.eachCell(cell => {
      cell.font      = { name: "Arial", bold: true, size: 9, color: { argb: "FF000000" } };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDDDDDD" } };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border    = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
   });
   ws.getRow(3).height = 24;

   // ── Data rows ──
   const totals = { areaInAcre: 0, billValue: 0, gst: 0, farmerShare: 0 };

   records.forEach((rec, i) => {
      totals.areaInAcre  += Number(rec.areaInAcre)  || 0;
      totals.billValue   += Number(rec.billValue)    || 0;
      totals.gst         += Number(rec.gst)          || 0;
      totals.farmerShare += Number(rec.farmerShare)  || 0;

      const vals = COLUMNS.map((col, ci) => {
         if (ci === 0) return rec.srNo ?? i + 1;
         if (col.date) return fmtDate(rec[col.key]);
         if (col.num === "acre") return num2(rec[col.key]);
         if (col.num === "int")  return numIN(rec[col.key]);
         return safe(rec[col.key]);
      });

      const row = ws.addRow(vals);
      row.eachCell((cell, colNum) => {
         const col = COLUMNS[colNum - 1];
         cell.font      = { name: "Arial", size: 9 };
         cell.alignment = { horizontal: col?.align ?? "left", vertical: "middle" };
         cell.border    = { top: { style: "hair", color: { argb: "FFCCCCCC" } }, bottom: { style: "hair", color: { argb: "FFCCCCCC" } }, left: { style: "hair", color: { argb: "FFCCCCCC" } }, right: { style: "hair", color: { argb: "FFCCCCCC" } } };
         cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: i % 2 === 0 ? "FFFFFFFF" : "FFF9F9F9" } };
      });

      // Number formats
      row.getCell(13).numFmt = "0.00";   // areaInAcre
      row.getCell(16).numFmt = "#,##0";  // billValue
      row.getCell(17).numFmt = "#,##0";  // gst
      row.getCell(18).numFmt = "#,##0";  // farmerShare
      row.height = 16;
   });

   // ── Total row ──
   const totalVals = COLUMNS.map((col, ci) => {
      if (ci === 0) return `TOTAL   ${records.length} Record${records.length !== 1 ? "s" : ""}`;
      if (col.key === "areaInAcre")  return Number(totals.areaInAcre.toFixed(2));
      if (col.key === "billValue")   return Math.round(totals.billValue);
      if (col.key === "gst")         return Math.round(totals.gst);
      if (col.key === "farmerShare") return Math.round(totals.farmerShare);
      return "";
   });

   const tr = ws.addRow(totalVals);

   // Merge label across first 12 cols
   ws.mergeCells(`A${tr.number}:L${tr.number}`);

   tr.eachCell((cell, colNum) => {
      cell.font      = { name: "Arial", bold: true, size: 9 };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFACD" } };
      cell.alignment = { horizontal: colNum === 1 ? "left" : "right", vertical: "middle" };
      cell.border    = { top: { style: "medium" }, bottom: { style: "medium" }, left: { style: "thin" }, right: { style: "thin" } };
   });
   tr.getCell(13).numFmt = "0.00";
   tr.getCell(16).numFmt = "#,##0";
   tr.getCell(17).numFmt = "#,##0";
   tr.getCell(18).numFmt = "#,##0";
   tr.height = 18;

   ws.views = [{ state: "frozen", xSplit: 1, ySplit: 3 }];
   ws.pageSetup = { orientation: "landscape", paperSize: 9, fitToWidth: 1, fitToHeight: 0 };

   return wb.xlsx.writeBuffer();
}