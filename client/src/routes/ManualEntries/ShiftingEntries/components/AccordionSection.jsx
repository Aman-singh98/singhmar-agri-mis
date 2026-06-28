

import { useState } from "react";

function AccordionSection({
   title, subtitle, badge,
   accentTitle, accentBorder, accentHeader, accentChevron,
   defaultOpen = true, children,
}) {
   const [open, setOpen] = useState(defaultOpen);

   return (
      <div className={`border ${accentBorder} overflow-hidden`}>

         {/* ── Header ── */}
         <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className={`w-full flex items-center justify-between px-4 py-3
               ${accentHeader} border-b ${open ? accentBorder : "border-transparent"}
               transition-colors focus:outline-none`}
         >
            <div className="flex items-center gap-2.5 text-left">
               <div>
                  <p className={`text-sm font-semibold ${accentTitle}`}>{title}</p>
                  {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
               </div>
               {badge !== undefined && badge > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 tabular-nums
                     ${accentTitle} bg-white border ${accentBorder}`}>
                     {badge}
                  </span>
               )}
            </div>
            <span className={accentChevron}>
               <svg
                  className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
               >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
               </svg>
            </span>
         </button>

         {/* ── Body ── */}
         <div className={`divide-y divide-slate-100 transition-all duration-200 overflow-hidden
            ${open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
            {children}
         </div>
      </div>
   );
}

export default AccordionSection;