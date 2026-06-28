
// PanelTabs.jsx
import Pdf from "../../../components/Pdf";
import Excel from "../../../components/Excel";
import { HiDocumentText, HiTable } from "react-icons/hi";

function PanelTabs({
   tabs,
   activeTab,
   onChange,
   model,
   fileName,
   pdfTab,
   financialYear = "",
   dealerName = "",
   data = null,
}) {
   const resolvedModel = pdfTab && pdfTab !== "summary"
      ? `${model}-${pdfTab}`
      : model;

   const resolvedFile = pdfTab && pdfTab !== "summary"
      ? `${fileName}-${pdfTab}`
      : fileName;

   return (
      <div className="mb-6">
         <div className="flex items-center justify-between border-b border-slate-300">
            <div className="flex gap-0">
               {tabs.map(tab => (
                  <button
                     key={tab.key}
                     onClick={() => onChange(tab.key)}
                     className={`
                        px-4 py-2.5 text-xs font-bold uppercase tracking-wider
                        border-b-2 transition-colors cursor-pointer
                        ${activeTab === tab.key
                           ? "text-green-700 border-green-600 bg-green-50/50"
                           : "text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50"
                        }
                     `}
                  >
                     {tab.label}
                  </button>
               ))}
            </div>
            
            {model && (
               <div className="flex items-center gap-1 pb-1">
                  <Pdf
                     model={resolvedModel}
                     fileName={resolvedFile}
                     label="PDF"
                     financialYear={financialYear}
                     dealerName={dealerName}
                     data={data}
                  />
                  <Excel
                     model={resolvedModel}
                     fileName={resolvedFile}
                     label="Excel"
                     financialYear={financialYear}
                     dealerName={dealerName}
                     data={data}
                  />
               </div>
            )}
         </div>
      </div>
   );
}

export default PanelTabs;