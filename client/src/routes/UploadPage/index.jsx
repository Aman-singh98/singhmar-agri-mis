
// import { useState } from "react";
// import { HiCloudUpload, HiRefresh, HiInformationCircle } from "react-icons/hi";
// import { FinancialYearSelect } from "../../components/app";
// import { FILE_TYPES } from "./components/constants";
// import { useUpload } from "./components/useUpload";
// import FileSlot from "./components/FileSlot";
// import UploadHistory from "./components/UploadHistory";
// import ManualEntry from "./components/ManualEntry";

// // const PAGE_TABS = ["File Upload", "Manual Entry", "Upload History"];
// const PAGE_TABS = ["File Upload", "Manual Entry"];

// function UploadPage() {
//    const {
//       selectedYear, handleYearChange,
//       slots, dragOver, inputRefs,
//       handleFileSelect, handleRemoveFile,
//       handleDragOver, handleDragLeave, handleDrop,
//       uploadSlot, handleUploadAll, handleReset,
//       filesAssignedCount, isAnySlotUploading, areAllAssignedDone,
//       uploadHistory, setUploadHistory,
//    } = useUpload();

//    const [activeTab, setActiveTab] = useState(0);

//    return (
//       <div className="flex flex-col h-full overflow-hidden bg-slate-50 font-sans">

//          {/* ── Page Header ─────────────────────────────────────── */}
//          <div className="flex-none bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 sm:py-4
//             flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
//             <div className="min-w-0">
//                <p className="text-[10px] uppercase tracking-widest text-green-600 font-semibold mb-0.5">
//                   Data Management
//                </p>
//                <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight leading-tight">
//                   Upload Data
//                </h1>
//                <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
//                   Attach files and upload for the selected financial year
//                </p>
//             </div>

//             {/* Year selector — stacks below title on xs, inline on sm+ */}
//             <div className="flex items-center gap-2 self-start sm:self-auto
//                bg-white border border-slate-200 px-3 py-2 shadow-sm flex-shrink-0">
//                <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">
//                   Financial Year
//                </label>
//                <FinancialYearSelect
//                   value={selectedYear}
//                   onChange={handleYearChange}
//                   disabled={isAnySlotUploading}
//                />
//             </div>
//          </div>

//          {/* ── Tab Bar ─────────────────────────────────────────── */}
//          <div className="flex-none flex gap-0 sm:gap-1 border-b-2 border-slate-200 bg-white
//             px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
//             {PAGE_TABS.map((t, i) => (
//                <button
//                   key={t}
//                   onClick={() => setActiveTab(i)}
//                   className={`px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-0.5
//                      transition-colors cursor-pointer whitespace-nowrap flex-shrink-0
//                      ${activeTab === i
//                         ? "text-green-700 border-green-600"
//                         : "text-slate-400 border-transparent hover:text-slate-600"
//                      }`}
//                >
//                   {t}
//                </button>
//             ))}
//          </div>

//          {/* ── Tab Body ────────────────────────────────────────── */}
//          <div className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-5">

//             {/* ── Tab 0: File Upload ──────────────────────────── */}
//             {activeTab === 0 && (
//                <div className="flex flex-col gap-4 sm:gap-5 max-w-screen-xl mx-auto">

//                   {/* 2-column grid on lg+, 1-column below */}
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 items-start">
//                      {FILE_TYPES.map(type => (
//                         <FileSlot
//                            key={type.key}
//                            type={type}
//                            slot={slots[type.key]}
//                            isDragOver={dragOver === type.key}
//                            inputRef={el => (inputRefs.current[type.key] = el)}
//                            onFileSelect={file => handleFileSelect(type.key, file)}
//                            onRemove={() => handleRemoveFile(type.key)}
//                            onDragOver={e => handleDragOver(e, type.key)}
//                            onDragLeave={handleDragLeave}
//                            onDrop={e => handleDrop(e, type.key)}
//                            onUploadSingle={() => uploadSlot(type.key, type.endpoint)}
//                            disabled={isAnySlotUploading}
//                            selectedYear={selectedYear}
//                         />
//                      ))}
//                   </div>

//                   {/* Action bar — full width below grid */}
//                   <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
//                    <button
//    onClick={handleUploadAll}
//    disabled={filesAssignedCount === 0 || isAnySlotUploading || areAllAssignedDone || !selectedYear}
//                         className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5
//                            bg-green-800 text-white text-[13px] font-bold uppercase tracking-wide
//                            hover:bg-green-900 disabled:opacity-30 disabled:cursor-not-allowed
//                            transition-all duration-150 shadow-sm"
//                      >
//                         <HiCloudUpload className="w-4 h-4 flex-shrink-0" />
//                         {isAnySlotUploading
//                            ? "Uploading…"
//                            : `Upload All${filesAssignedCount > 0 ? ` (${filesAssignedCount})` : ""}`}
//                      </button>

//                      {areAllAssignedDone && (
//                         <button
//                            onClick={handleReset}
//                            className="flex items-center justify-center gap-1.5 px-4 py-2.5
//                               border border-green-200 text-green-700 text-[13px] font-semibold
//                               hover:bg-green-50 transition bg-white shadow-sm sm:w-auto w-full"
//                         >
//                            <HiRefresh className="w-3.5 h-3.5 flex-shrink-0" />
//                            Reset
//                         </button>
//                      )}
//                   </div>

//                   {/* Info note */}
//                   <div className="flex items-start gap-2 text-[11px] text-green-700
//                      bg-green-50 border border-green-200 px-3 py-2.5">
//                      <HiInformationCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-green-500" />
//                      <p>
//                         After upload, the backend recalculates Total A, Total B, Net Balance,
//                         and Extra Subsidy for every dealer.
//                      </p>
//                   </div>
//                </div>
//             )}

//             {/* ── Tab 1: Manual Entry ─────────────────────────── */}
//            {activeTab === 1 && (
//    <div className="max-w-screen-xl mx-auto">
//       <ManualEntry allowedTabs={["paidCash", "incentives"]} />
//    </div>
// )}

//             {/* ── Tab 2: Upload History ───────────────────────── */}
//             {/* {activeTab === 2 && (
//                <div className="max-w-screen-xl mx-auto">
//                   <UploadHistory
//                      history={uploadHistory}
//                      onClear={() => setUploadHistory([])}
//                   />
//                </div>
//             )} */}

//          </div>
//       </div>
//    );
// }

// export default UploadPage;

















import { useState } from "react";
import { HiCloudUpload, HiRefresh, HiInformationCircle, HiCalendar, HiLightningBolt } from "react-icons/hi";
import { FinancialYearSelect } from "../../components/app";
import { FY_FILE_TYPES, NON_FY_FILE_TYPES } from "./components/constants";
import { useUpload } from "./components/useUpload";
import FileSlot from "./components/FileSlot";
import ManualEntry from "./components/ManualEntry";

const PAGE_TABS = ["File Upload", "Manual Entry"];

function UploadPage() {
   const {
      selectedYear, handleYearChange,
      slots, dragOver, inputRefs,
      handleFileSelect, handleRemoveFile,
      handleDragOver, handleDragLeave, handleDrop,
      uploadSlot, handleUploadAllFY, handleUploadAllNonFY, handleReset,
      fyAssignedCount, isFYSlotUploading, areFYAssignedDone,
      nonFYAssignedCount, isNonFYSlotUploading, areNonFYAssignedDone,
      filesAssignedCount, isAnySlotUploading, areAllAssignedDone,
      uploadHistory, setUploadHistory,
   } = useUpload();

   const [activeTab, setActiveTab] = useState(0);

   return (
      <div className="flex flex-col h-full overflow-hidden bg-slate-50 font-sans">

         {/* ── Page Header ─────────────────────────────────────── */}
         <div className="flex-none bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <p className="text-[10px] uppercase tracking-widest text-green-600 font-semibold mb-0.5">
               Data Management
            </p>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight leading-tight">
               Upload Data
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
               Attach files and upload — some files require a financial year selection
            </p>
         </div>

         {/* ── Tab Bar ─────────────────────────────────────────── */}
         <div className="flex-none flex gap-0 sm:gap-1 border-b-2 border-slate-200 bg-white
            px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
            {PAGE_TABS.map((t, i) => (
               <button
                  key={t}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-0.5
                     transition-colors cursor-pointer whitespace-nowrap flex-shrink-0
                     ${activeTab === i
                        ? "text-green-700 border-green-600"
                        : "text-slate-400 border-transparent hover:text-slate-600"
                     }`}
               >
                  {t}
               </button>
            ))}
         </div>

         {/* ── Tab Body ────────────────────────────────────────── */}
         <div className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-5">

            {/* ── Tab 0: File Upload ──────────────────────────── */}
            {activeTab === 0 && (
               <div className="flex flex-col gap-6 max-w-screen-xl mx-auto">

                  {/* ════════════════════════════════════════════════
                      SECTION 1 — Financial Year Required
                  ════════════════════════════════════════════════ */}
                  <div className="flex flex-col gap-3 sm:gap-4">

                     {/* Section header with FY selector inline */}
                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
                        pb-2 border-b-2 border-green-200">
                        <div className="flex items-center gap-2.5">
                           <div className="w-7 h-7 bg-green-700 flex items-center justify-center flex-shrink-0">
                              <HiCalendar className="w-4 h-4 text-white" />
                           </div>
                           <div>
                              <p className="text-[13px] font-bold text-slate-800 uppercase tracking-wide leading-tight">
                                 Financial Year Files
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                 These files require a Financial Year to be selected before uploading
                              </p>
                           </div>
                        </div>

                        {/* FY selector */}
                        <div className="flex items-center gap-2 self-start sm:self-auto
                           bg-white border border-slate-200 px-3 py-2 shadow-sm flex-shrink-0">
                           <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                              Financial Year
                           </label>
                           <FinancialYearSelect
                              value={selectedYear}
                              onChange={handleYearChange}
                              disabled={isFYSlotUploading}
                           />
                        </div>
                     </div>

                     {/* FY file slots grid */}
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 items-start">
                        {FY_FILE_TYPES.map(type => (
                           <FileSlot
                              key={type.key}
                              type={type}
                              slot={slots[type.key]}
                              isDragOver={dragOver === type.key}
                              inputRef={el => (inputRefs.current[type.key] = el)}
                              onFileSelect={file => handleFileSelect(type.key, file)}
                              onRemove={() => handleRemoveFile(type.key)}
                              onDragOver={e => handleDragOver(e, type.key)}
                              onDragLeave={handleDragLeave}
                              onDrop={e => handleDrop(e, type.key)}
                              onUploadSingle={() => uploadSlot(type.key, type.endpoint, true)}
                              disabled={isAnySlotUploading}
                              selectedYear={selectedYear}
                              requiresFY={true}
                           />
                        ))}
                     </div>

                     {/* FY action bar */}
                     <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <button
                           onClick={handleUploadAllFY}
                           disabled={fyAssignedCount === 0 || isFYSlotUploading || areFYAssignedDone || !selectedYear}
                           className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5
                              bg-green-800 text-white text-[13px] font-bold uppercase tracking-wide
                              hover:bg-green-900 disabled:opacity-30 disabled:cursor-not-allowed
                              transition-all duration-150 shadow-sm"
                        >
                           <HiCloudUpload className="w-4 h-4 flex-shrink-0" />
                           {isFYSlotUploading
                              ? "Uploading…"
                              : `Upload FY Files${fyAssignedCount > 0 ? ` (${fyAssignedCount})` : ""}`}
                        </button>
                        {areFYAssignedDone && (
                           <button
                              onClick={handleReset}
                              className="flex items-center justify-center gap-1.5 px-4 py-2.5
                                 border border-green-200 text-green-700 text-[13px] font-semibold
                                 hover:bg-green-50 transition bg-white shadow-sm sm:w-auto w-full"
                           >
                              <HiRefresh className="w-3.5 h-3.5 flex-shrink-0" />
                              Reset
                           </button>
                        )}
                     </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-200" />

                  {/* ════════════════════════════════════════════════
                      SECTION 2 — No Financial Year Required
                  ════════════════════════════════════════════════ */}
                  <div className="flex flex-col gap-3 sm:gap-4">

                     {/* Section header */}
                     <div className="flex items-center gap-2.5 pb-2 border-b-2 border-slate-200">
                        <div className="w-7 h-7 bg-slate-600 flex items-center justify-center flex-shrink-0">
                           <HiLightningBolt className="w-4 h-4 text-white" />
                        </div>
                        <div>
                           <p className="text-[13px] font-bold text-slate-800 uppercase tracking-wide leading-tight">
                              General Files
                           </p>
                           <p className="text-[11px] text-slate-400 mt-0.5">
                              These files can be uploaded directly — no Financial Year needed
                           </p>
                        </div>
                     </div>

                     {/* Non-FY file slots grid */}
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 items-start">
                        {NON_FY_FILE_TYPES.map(type => (
                           <FileSlot
                              key={type.key}
                              type={type}
                              slot={slots[type.key]}
                              isDragOver={dragOver === type.key}
                              inputRef={el => (inputRefs.current[type.key] = el)}
                              onFileSelect={file => handleFileSelect(type.key, file)}
                              onRemove={() => handleRemoveFile(type.key)}
                              onDragOver={e => handleDragOver(e, type.key)}
                              onDragLeave={handleDragLeave}
                              onDrop={e => handleDrop(e, type.key)}
                              onUploadSingle={() => uploadSlot(type.key, type.endpoint, false)}
                              disabled={isAnySlotUploading}
                              selectedYear={null}
                              requiresFY={false}
                           />
                        ))}
                     </div>

                     {/* Non-FY action bar */}
                     <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <button
                           onClick={handleUploadAllNonFY}
                           disabled={nonFYAssignedCount === 0 || isNonFYSlotUploading || areNonFYAssignedDone}
                           className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5
                              bg-slate-700 text-white text-[13px] font-bold uppercase tracking-wide
                              hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed
                              transition-all duration-150 shadow-sm"
                        >
                           <HiCloudUpload className="w-4 h-4 flex-shrink-0" />
                           {isNonFYSlotUploading
                              ? "Uploading…"
                              : `Upload General Files${nonFYAssignedCount > 0 ? ` (${nonFYAssignedCount})` : ""}`}
                        </button>
                        {areNonFYAssignedDone && (
                           <button
                              onClick={handleReset}
                              className="flex items-center justify-center gap-1.5 px-4 py-2.5
                                 border border-slate-200 text-slate-600 text-[13px] font-semibold
                                 hover:bg-slate-50 transition bg-white shadow-sm sm:w-auto w-full"
                           >
                              <HiRefresh className="w-3.5 h-3.5 flex-shrink-0" />
                              Reset
                           </button>
                        )}
                     </div>
                  </div>

                  {/* Info note */}
                  <div className="flex items-start gap-2 text-[11px] text-green-700
                     bg-green-50 border border-green-200 px-3 py-2.5">
                     <HiInformationCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-green-500" />
                     <p>
                        After upload, the backend recalculates Total A, Total B, Net Balance,
                        and Extra Subsidy for every dealer.
                     </p>
                  </div>
               </div>
            )}

            {/* ── Tab 1: Manual Entry ─────────────────────────── */}
            {activeTab === 1 && (
               <div className="max-w-screen-xl mx-auto">
                  <ManualEntry allowedTabs={["paidCash", "incentives"]} />
               </div>
            )}
         </div>
      </div>
   );
}

export default UploadPage;