import { HiUpload, HiDocumentText, HiX, HiCheckCircle, HiExclamationCircle } from "react-icons/hi";
import { ACCEPTED_EXTENSIONS } from "./constants";
import { formatFY, formatFileSize } from "./helpers";
import StatusBadge from "./StatusBadge";

function FileSlot({
   type, slot, isDragOver, inputRef,
   onFileSelect, onRemove, onDragOver, onDragLeave, onDrop,
   onUploadSingle, disabled, selectedYear,
   requiresFY = true,   // ← new prop: false = no FY check needed
}) {
   const { file, fileError, status, progress, result, errorMsg } = slot;
   const isUploading = status === "uploading";

   // For non-FY slots, dropzone is always active; for FY slots, blocked until year selected
   const dropzoneBlocked = requiresFY && !selectedYear;

   return (
      <div className={`border transition-all duration-200 overflow-hidden
         ${status === "success" ? "border-green-400 bg-green-50"
            : status === "error"    ? "border-red-400 bg-red-50"
            : isUploading           ? "border-green-300 bg-green-50"
                                    : "border-gray-300 bg-white hover:border-green-400"}`}
      >

         {/* ── Slot Header ───────────────────────────────────── */}
         <div className={`flex items-center justify-between px-3 sm:px-4 py-2.5 border-b
            ${status === "success" ? "bg-green-100 border-green-300"
               : status === "error" ? "bg-red-100 border-red-300"
               : "bg-gray-100 border-gray-200"}`}
         >
            <div className="min-w-0 flex-1 pr-2">
               <p className="text-[12px] sm:text-[13px] font-semibold text-black leading-tight truncate">
                  {type.label}
               </p>
               <p className="text-[10px] sm:text-[11px] text-black font-mono mt-0.5 truncate opacity-60">
                  Accepted: {type.acceptedName}
               </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
               {/* Only show FY badge for FY-required slots */}
               {requiresFY && (
                  <span className="text-[10px] sm:text-[11px] text-black font-mono bg-white
                     border border-gray-300 px-1.5 sm:px-2 py-0.5 whitespace-nowrap">
                     {formatFY(selectedYear)}
                  </span>
               )}
               <StatusBadge status={status} progress={progress} />
            </div>
         </div>

         {/* ── Slot Body ─────────────────────────────────────── */}
         <div className="px-3 sm:px-4 py-3 space-y-2.5">

            {/* Drop zone */}
            {!file && status !== "success" && (
               <>
                  <div
                     role="button" tabIndex={0}
                     onDragOver={!dropzoneBlocked ? onDragOver : e => e.preventDefault()}
                     onDragLeave={!dropzoneBlocked ? onDragLeave : undefined}
                     onDrop={!dropzoneBlocked ? onDrop : e => e.preventDefault()}
                     onClick={() => !dropzoneBlocked && document.getElementById(`input-${type.key}`)?.click()}
                     onKeyDown={e => !dropzoneBlocked && (e.key === "Enter" || e.key === " ") && document.getElementById(`input-${type.key}`)?.click()}
                     className={`group flex items-center gap-3 p-3 border-2 border-dashed transition-all select-none
                        ${dropzoneBlocked
                           ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                           : isDragOver
                              ? "border-green-500 bg-green-50 cursor-pointer"
                              : fileError
                                 ? "border-red-400 bg-red-50 cursor-pointer"
                                 : "border-gray-300 hover:border-green-400 hover:bg-green-50 cursor-pointer"
                        }`}
                  >
                     <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 transition-colors
                        ${isDragOver ? "bg-green-100" : "bg-gray-200 group-hover:bg-green-100"}`}>
                        <HiUpload className={`w-4 h-4 ${isDragOver ? "text-green-700" : "text-black group-hover:text-green-700"}`} />
                     </div>
                     <div className="min-w-0">
                        <p className="text-[12px] sm:text-[13px] font-medium text-black">
                           {dropzoneBlocked
                              ? "Select a financial year first"
                              : isDragOver ? "Release to attach" : "Drag file here or click to browse"}
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-black opacity-50 mt-0.5">
                           .xlsx · .xls · .csv — max 100 MB
                        </p>
                     </div>
                  </div>
                  <input
                     id={`input-${type.key}`} ref={inputRef} type="file"
                     accept={ACCEPTED_EXTENSIONS.join(",")} className="hidden"
                     disabled={dropzoneBlocked}
                     onChange={e => { const f = e.target.files?.[0]; if (f) onFileSelect(f); e.target.value = ""; }}
                  />
                  {fileError && (
                     <div className="flex items-center gap-1.5 text-[11px] text-black
                        bg-red-100 border border-red-300 px-2.5 py-1.5">
                        <HiExclamationCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-600" />
                        {fileError}
                     </div>
                  )}
               </>
            )}

            {/* File ready */}
            {file && status === "idle" && (
               <div className="flex items-center gap-2 sm:gap-3 bg-green-50 border border-green-300 px-3 py-2">
                  <div className="w-8 h-8 bg-white border border-green-300 flex items-center justify-center flex-shrink-0">
                     <HiDocumentText className="w-4 h-4 text-green-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-[12px] sm:text-[13px] font-semibold text-black truncate leading-tight">
                        {file.name}
                     </p>
                     <p className="text-[10px] sm:text-[11px] text-black opacity-50 mt-0.5 font-mono">
                        {formatFileSize(file.size)}
                     </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                     {!disabled && (
                        <button
                           onClick={onRemove}
                           className="w-7 h-7 flex items-center justify-center text-black
                              opacity-40 hover:opacity-100 hover:text-red-600 transition"
                           title="Remove"
                        >
                           <HiX className="w-3.5 h-3.5" />
                        </button>
                     )}
                     <button
                        onClick={onUploadSingle}
                        disabled={disabled || dropzoneBlocked}
                        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5
                           bg-green-800 text-white text-[11px] font-bold uppercase tracking-wide
                           hover:bg-green-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
                     >
                        <HiUpload className="w-3 h-3 flex-shrink-0" /> Upload
                     </button>
                  </div>
               </div>
            )}

            {/* Progress */}
            {status === "uploading" && (
               <div className="space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                     <span className="flex items-center gap-1.5 text-black font-medium min-w-0">
                        <span className="w-1.5 h-1.5 bg-green-600 animate-pulse flex-shrink-0" />
                        <span className="truncate">{file?.name}</span>
                     </span>
                     <span className="font-mono font-bold text-black flex-shrink-0 ml-2">
                        {progress}%
                     </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 overflow-hidden">
                     <div
                        className="h-full bg-green-700 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                     />
                  </div>
               </div>
            )}

            {/* Success */}
            {status === "success" && result && (
               <div className="flex items-center gap-3 bg-green-100 border border-green-300 px-3 py-2">
                  <HiCheckCircle className="w-5 h-5 text-green-700 flex-shrink-0" />
                  <div className="min-w-0">
                     <p className="text-[12px] sm:text-[13px] font-semibold text-black truncate">
                        {file?.name}
                     </p>
                     {result.totalRows > 0 && (
                        <p className="text-[10px] sm:text-[11px] text-black opacity-60 mt-0.5 font-mono">
                           {result.totalRows} rows processed
                        </p>
                     )}
                  </div>
               </div>
            )}

            {/* Error */}
            {status === "error" && (
               <div className="flex items-start gap-3 bg-red-100 border border-red-300 px-3 py-2">
                  <HiExclamationCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                     <p className="text-[12px] sm:text-[13px] font-semibold text-black truncate">
                        {file?.name}
                     </p>
                     <p className="text-[11px] text-black opacity-60 mt-0.5">{errorMsg}</p>
                  </div>
                  <button
                     onClick={onRemove}
                     className="text-black opacity-40 hover:opacity-100 hover:text-red-600 transition p-0.5 flex-shrink-0"
                  >
                     <HiX className="w-3.5 h-3.5" />
                  </button>
               </div>
            )}
         </div>
      </div>
   );
}

export default FileSlot;