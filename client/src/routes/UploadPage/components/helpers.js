import { FILE_TYPES, ACCEPTED_EXTENSIONS, MAX_FILE_SIZE_BYTES } from "./constants";

export function getCurrentFY() {
   const now = new Date();
   const calYear = now.getFullYear();
   const start = now.getMonth() >= 3 ? calYear : calYear - 1;
   // ✅ 2026-27 format
   return `${start}-${String(start + 1).slice(-2)}`;
}

export function formatFY(fy) {
   if (!fy) return "FY —";
   return `FY ${fy}`;  // ✅ as-is — already "2026-27" format hai
}

export function formatFileSize(bytes) {
   if (bytes < 1024) return `${bytes} B`;
   if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
   return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateFile(file, acceptedName) {
   if (!file) return { valid: false, error: "No file selected." };
   if (acceptedName && file.name !== acceptedName)
      return { valid: false, error: `File must be "${acceptedName}"` };
   const ext = "." + file.name.split(".").pop().toLowerCase();
   if (!ACCEPTED_EXTENSIONS.includes(ext))
      return { valid: false, error: `Invalid type "${ext}". Use .xlsx, .xls, or .csv.` };
   if (file.size > MAX_FILE_SIZE_BYTES)
      return { valid: false, error: `Too large (${formatFileSize(file.size)}). Max 100 MB.` };
   return { valid: true, error: null };
}

export function buildInitialSlots() {
   return Object.fromEntries(
      FILE_TYPES.map(type => [
         type.key,
         { file: null, fileError: null, status: "idle", progress: 0, result: null, errorMsg: null },
      ])
   );
}

