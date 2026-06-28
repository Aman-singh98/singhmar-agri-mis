
import { HiCheckCircle, HiExclamationCircle } from "react-icons/hi";

function StatusBadge({ status, progress }) {
   if (status === "success")
      return (
         <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide text-black bg-green-100 border border-green-400 px-2 py-0.5 uppercase">
            <HiCheckCircle className="w-3 h-3 text-green-700" /> Done
         </span>
      );
   if (status === "error")
      return (
         <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide text-black bg-red-100 border border-red-400 px-2 py-0.5 uppercase">
            <HiExclamationCircle className="w-3 h-3 text-red-600" /> Failed
         </span>
      );
   if (status === "uploading")
      return (
         <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-black bg-green-50 border border-green-400 px-2 py-0.5 font-mono">
            <span className="w-1.5 h-1.5 bg-green-600 animate-pulse" />
            {progress}%
         </span>
      );
   return null;
}

export default StatusBadge;