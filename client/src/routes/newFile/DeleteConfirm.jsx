import { HiOutlineTrash, HiOutlineExclamation, HiOutlineX } from "react-icons/hi";

function DeleteConfirm({ isOpen, record, onConfirm, onCancel, loading }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white shadow-2xl w-full max-w-sm border border-red-100">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-red-50">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 text-white">
              <HiOutlineTrash className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Delete Record</h3>
              <p className="text-xs text-red-500 font-medium">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 transition disabled:opacity-50"
          >
            <HiOutlineX className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 mb-5">
            <HiOutlineExclamation className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700">
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-900">{record?.name || "this record"}</span>'s file?
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 border border-red-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <HiOutlineTrash className="w-4 h-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DeleteConfirm;