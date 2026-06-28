/**
 * ConfirmDialog.jsx
 * Generic confirmation dialog — supports loading + error states.
 * No rounded corners, black text, Tailwind only.
 *
 * Props:
 *  isOpen      boolean
 *  title       string
 *  description string
 *  onConfirm   () => void
 *  onCancel    () => void
 *  loading?    boolean
 *  error?      string
 */

function ConfirmDialog({ isOpen, title, description, onConfirm, onCancel, loading = false, error = "" }) {
   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
         <div className="bg-white border border-black shadow-lg w-full max-w-sm">

            {/* Red top accent */}
            <div className="h-1 w-full bg-red-600" />

            <div className="p-6">
               {/* Icon + Title */}
               <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 w-9 h-9 bg-red-100 border border-red-300 flex items-center justify-center">
                     <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 3h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                     </svg>
                  </div>
                  <h2 className="text-base font-bold text-black">{title}</h2>
               </div>

               <p className="text-sm text-black/70 mb-4 leading-relaxed">{description}</p>

               {/* Inline API error */}
               {error && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-300 px-3 py-2 mb-4">
                     {error}
                  </p>
               )}

               {/* Actions */}
               <div className="flex justify-end gap-2">
                  <button
                     onClick={onCancel}
                     disabled={loading}
                     className="px-4 py-2 text-sm font-semibold text-black bg-white border border-black hover:bg-gray-50 disabled:opacity-50 transition"
                  >
                     Cancel
                  </button>
                  <button
                     onClick={onConfirm}
                     disabled={loading}
                     className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 transition"
                  >
                     {loading && (
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                     )}
                     {loading ? "Deleting…" : "Delete"}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}

export default ConfirmDialog;