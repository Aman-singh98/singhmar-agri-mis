// import { useState, useCallback, useRef } from "react";
// import { toast } from "react-toastify";
// import api from "../../../api/axios";
// import { FILE_TYPES } from "./constants";
// import { validateFile, buildInitialSlots, getCurrentFY } from "./helpers";

// // const DEFAULT_YEAR = getCurrentFY();

// export function useUpload() {
//    const [selectedYear, setSelectedYear] = useState("");
//    const [slots, setSlots] = useState(buildInitialSlots);
//    const [dragOver, setDragOver] = useState(null);
//    const [uploadHistory, setUploadHistory] = useState([]);
//    const inputRefs = useRef({});

//    function handleYearChange(e) {
//       setSelectedYear(e.target.value);
//    }

//    const updateSlot = useCallback(
//       (key, patch) => setSlots(prev => ({ ...prev, [key]: { ...prev[key], ...patch } })),
//       []
//    );

//    const handleFileSelect = useCallback(
//       (key, file) => {
//          const type = FILE_TYPES.find(t => t.key === key);
//          const { valid, error } = validateFile(file, type?.acceptedName);
//          if (!valid) { updateSlot(key, { fileError: error, file: null }); return; }
//          updateSlot(key, { file, fileError: null, status: "idle", progress: 0, result: null, errorMsg: null });
//       },
//       [updateSlot]
//    );

//    const handleRemoveFile = useCallback(
//       (key) => {
//          updateSlot(key, { file: null, fileError: null, status: "idle", progress: 0, result: null, errorMsg: null });
//          if (inputRefs.current[key]) inputRefs.current[key].value = "";
//       },
//       [updateSlot]
//    );

//    function handleDragOver(e, key) { e.preventDefault(); setDragOver(key); }
//    function handleDragLeave(e) { e.preventDefault(); setDragOver(null); }
//    function handleDrop(e, key) { e.preventDefault(); setDragOver(null); const file = e.dataTransfer.files?.[0]; if (file) handleFileSelect(key, file); }

//  const uploadSlot = useCallback(
//    async (typeKey, endpoint) => {
//       const slot = slots[typeKey];
//       if (!slot.file) return;

//       // ✅ year select nahi hua toh block karo
//       if (!selectedYear) {
//          toast.error("Please select a Financial Year before uploading.", { autoClose: 5000 });
//          return;
//       }

//       updateSlot(typeKey, { status: "uploading", progress: 0, result: null, errorMsg: null });
//          const formData = new FormData();
//          formData.append("file", slot.file);
//          formData.append("financialYear", selectedYear);

//          try {
//             const response = await api.post(endpoint, formData, {
//                headers: { "Content-Type": "multipart/form-data" },
//                onUploadProgress: e => {
//                   const pct = e.total ? Math.round((e.loaded * 100) / e.total) : 50;
//                   updateSlot(typeKey, { progress: pct });
//                },
//             });
//             const { counts = {}, skipped = [], errors = [], logId } = response.data ?? {};
//             const totalRows = (counts.mainData ?? 0) + (counts.billUpload ?? 0) + (counts.tallyBill ?? 0);
//             updateSlot(typeKey, {
//                status: "success",
//                result: { counts, skipped, errors, logId, totalRows, message: response.data?.message ?? "Upload successful." },
//             });
//             toast.success(`✓ ${slot.file.name} — ${totalRows} rows processed.`);
//             setUploadHistory(prev => [{
//                id: Date.now(), fileName: slot.file.name,
//                fileType: FILE_TYPES.find(t => t.key === typeKey)?.label ?? typeKey,
//                financialYear: selectedYear, counts, skipped, errors, logId, totalRows,
//                uploadedAt: new Date(), status: "success",
//             }, ...prev]);
//    } catch (err) {
//    // ✅ backend 'error' ya 'message' dono handle karo
//    const errData = err.response?.data;
//    const errorMessage = errData?.error ?? errData?.message ?? err.message ?? "Upload failed.";
   
//    updateSlot(typeKey, { status: "error", errorMsg: errorMessage });
//    toast.error(`❌ ${slot.file.name}: ${errorMessage}`, {
//       autoClose: 8000,        // ✅ thoda zyada time — lamba error message padh sakein
//       style: { whiteSpace: "pre-wrap" },  // ✅ long message wrap hoga
//    });
   
//    setUploadHistory(prev => [{
//       id: Date.now() + 1, fileName: slot.file.name,
//       fileType: FILE_TYPES.find(t => t.key === typeKey)?.label ?? typeKey,
//       financialYear: selectedYear, counts: {}, skipped: [], errors: [], logId: null, totalRows: 0,
//       uploadedAt: new Date(), status: "error",
//    }, ...prev]);
// }
//       },
//       [slots, selectedYear, updateSlot]
//    );

//  async function handleUploadAll() {
//    // ✅ year check
//    if (!selectedYear) {
//       toast.error("Please select a Financial Year before uploading.", { autoClose: 5000 });
//       return;
//    }
//    const pending = FILE_TYPES.filter(t => slots[t.key].file && slots[t.key].status === "idle");
//    if (!pending.length) return;
//    await Promise.all(pending.map(t => uploadSlot(t.key, t.endpoint)));
// }

//    function handleReset() {
//       setSlots(buildInitialSlots());
//       Object.values(inputRefs.current).forEach(el => { if (el) el.value = ""; });
//    }

//    const filesAssignedCount = FILE_TYPES.filter(t => slots[t.key].file).length;
//    const isAnySlotUploading = FILE_TYPES.some(t => slots[t.key].status === "uploading");
//    const areAllAssignedDone =
//       filesAssignedCount > 0 &&
//       FILE_TYPES.filter(t => slots[t.key].file).every(
//          t => slots[t.key].status === "success" || slots[t.key].status === "error"
//       );

//    return {
//       selectedYear, handleYearChange,
//       slots, dragOver, inputRefs,
//       handleFileSelect, handleRemoveFile,
//       handleDragOver, handleDragLeave, handleDrop,
//       uploadSlot, handleUploadAll, handleReset,
//       filesAssignedCount, isAnySlotUploading, areAllAssignedDone,
//       uploadHistory, setUploadHistory,
//    };
// }











import { useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import api from "../../../api/axios";
import { FILE_TYPES, FY_FILE_TYPES, NON_FY_FILE_TYPES } from "./constants";
import { validateFile, buildInitialSlots, getCurrentFY } from "./helpers";

export function useUpload() {
   const [selectedYear, setSelectedYear] = useState("");
   const [slots, setSlots] = useState(buildInitialSlots);
   const [dragOver, setDragOver] = useState(null);
   const [uploadHistory, setUploadHistory] = useState([]);
   const inputRefs = useRef({});

   function handleYearChange(e) {
      setSelectedYear(e.target.value);
   }

   const updateSlot = useCallback(
      (key, patch) => setSlots(prev => ({ ...prev, [key]: { ...prev[key], ...patch } })),
      []
   );

   const handleFileSelect = useCallback(
      (key, file) => {
         const type = FILE_TYPES.find(t => t.key === key);
         const { valid, error } = validateFile(file, type?.acceptedName);
         if (!valid) { updateSlot(key, { fileError: error, file: null }); return; }
         updateSlot(key, { file, fileError: null, status: "idle", progress: 0, result: null, errorMsg: null });
      },
      [updateSlot]
   );

   const handleRemoveFile = useCallback(
      (key) => {
         updateSlot(key, { file: null, fileError: null, status: "idle", progress: 0, result: null, errorMsg: null });
         if (inputRefs.current[key]) inputRefs.current[key].value = "";
      },
      [updateSlot]
   );

   function handleDragOver(e, key) { e.preventDefault(); setDragOver(key); }
   function handleDragLeave(e) { e.preventDefault(); setDragOver(null); }
   function handleDrop(e, key) { e.preventDefault(); setDragOver(null); const file = e.dataTransfer.files?.[0]; if (file) handleFileSelect(key, file); }

   const uploadSlot = useCallback(
      async (typeKey, endpoint, requiresFY = true) => {
         const slot = slots[typeKey];
         if (!slot.file) return;

         if (requiresFY && !selectedYear) {
            toast.error("Please select a Financial Year before uploading.", { autoClose: 2000 });
            return;
         }

         updateSlot(typeKey, { status: "uploading", progress: 0, result: null, errorMsg: null });
         const formData = new FormData();
         formData.append("file", slot.file);
         if (requiresFY) formData.append("financialYear", selectedYear);

         try {
            const response = await api.post(endpoint, formData, {
               headers: { "Content-Type": "multipart/form-data" },
               onUploadProgress: e => {
                  const pct = e.total ? Math.round((e.loaded * 100) / e.total) : 50;
                  updateSlot(typeKey, { progress: pct });
               },
            });
            const { counts = {}, skipped = [], errors = [], logId } = response.data ?? {};
            const totalRows = (counts.mainData ?? 0) + (counts.billUpload ?? 0) + (counts.tallyBill ?? 0);
            updateSlot(typeKey, {
               status: "success",
               result: { counts, skipped, errors, logId, totalRows, message: response.data?.message ?? "Upload successful." },
            });
            toast.success(`✓ ${slot.file.name} — ${totalRows} rows processed.`);
            setUploadHistory(prev => [{
               id: Date.now(), fileName: slot.file.name,
               fileType: FILE_TYPES.find(t => t.key === typeKey)?.label ?? typeKey,
               financialYear: requiresFY ? selectedYear : null,
               counts, skipped, errors, logId, totalRows,
               uploadedAt: new Date(), status: "success",
            }, ...prev]);
         } catch (err) {
            const errData = err.response?.data;
            const errorMessage = errData?.error ?? errData?.message ?? err.message ?? "Upload failed.";
            updateSlot(typeKey, { status: "error", errorMsg: errorMessage });
            toast.error(`❌ ${slot.file.name}: ${errorMessage}`, {
               autoClose: 8000,
               style: { whiteSpace: "pre-wrap" },
            });
            setUploadHistory(prev => [{
               id: Date.now() + 1, fileName: slot.file.name,
               fileType: FILE_TYPES.find(t => t.key === typeKey)?.label ?? typeKey,
               financialYear: requiresFY ? selectedYear : null,
               counts: {}, skipped: [], errors: [], logId: null, totalRows: 0,
               uploadedAt: new Date(), status: "error",
            }, ...prev]);
         }
      },
      [slots, selectedYear, updateSlot]
   );

   // Upload all FY-dependent files
   async function handleUploadAllFY() {
      if (!selectedYear) {
         toast.error("Please select a Financial Year before uploading.", { autoClose: 2000 });
         return;
      }
      const pending = FY_FILE_TYPES.filter(t => slots[t.key].file && slots[t.key].status === "idle");
      if (!pending.length) return;
      await Promise.all(pending.map(t => uploadSlot(t.key, t.endpoint, true)));
   }

   // Upload all non-FY files
   async function handleUploadAllNonFY() {
      const pending = NON_FY_FILE_TYPES.filter(t => slots[t.key].file && slots[t.key].status === "idle");
      if (!pending.length) return;
      await Promise.all(pending.map(t => uploadSlot(t.key, t.endpoint, false)));
   }

   function handleReset() {
      setSlots(buildInitialSlots());
      Object.values(inputRefs.current).forEach(el => { if (el) el.value = ""; });
   }

   // FY section counts
   const fyAssignedCount = FY_FILE_TYPES.filter(t => slots[t.key].file).length;
   const isFYSlotUploading = FY_FILE_TYPES.some(t => slots[t.key].status === "uploading");
   const areFYAssignedDone =
      fyAssignedCount > 0 &&
      FY_FILE_TYPES.filter(t => slots[t.key].file).every(
         t => slots[t.key].status === "success" || slots[t.key].status === "error"
      );

   // Non-FY section counts
   const nonFYAssignedCount = NON_FY_FILE_TYPES.filter(t => slots[t.key].file).length;
   const isNonFYSlotUploading = NON_FY_FILE_TYPES.some(t => slots[t.key].status === "uploading");
   const areNonFYAssignedDone =
      nonFYAssignedCount > 0 &&
      NON_FY_FILE_TYPES.filter(t => slots[t.key].file).every(
         t => slots[t.key].status === "success" || slots[t.key].status === "error"
      );

   const isAnySlotUploading = isFYSlotUploading || isNonFYSlotUploading;
   const filesAssignedCount = fyAssignedCount + nonFYAssignedCount;
   const areAllAssignedDone = areFYAssignedDone && areNonFYAssignedDone;

   return {
      selectedYear, handleYearChange,
      slots, dragOver, inputRefs,
      handleFileSelect, handleRemoveFile,
      handleDragOver, handleDragLeave, handleDrop,
      uploadSlot, handleUploadAllFY, handleUploadAllNonFY, handleReset,
      // FY section
      fyAssignedCount, isFYSlotUploading, areFYAssignedDone,
      // Non-FY section
      nonFYAssignedCount, isNonFYSlotUploading, areNonFYAssignedDone,
      // Combined
      filesAssignedCount, isAnySlotUploading, areAllAssignedDone,
      uploadHistory, setUploadHistory,
   };
}