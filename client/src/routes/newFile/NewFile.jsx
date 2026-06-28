
import { useState } from "react";
import AddNewFile from "./AddNewFile";
import FileRecord from "./FileRecord";
import MicadaComparison from "./MicadaComparison";
import {
  HiOutlineDocumentAdd,
  HiOutlineCollection,
  HiOutlineSwitchHorizontal,
} from "react-icons/hi";

const TABS = [
  { key: "add",        label: "Add New File",     icon: HiOutlineDocumentAdd },
  { key: "records",    label: "File Records",      icon: HiOutlineCollection },
  { key: "comparison", label: "MICADA Comparison", icon: HiOutlineSwitchHorizontal },
];

function NewFile() {
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50 font-sans">

      {/* Page Header */}
      <div className="flex-none bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-7 py-3 sm:py-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-2 text-white">
            <HiOutlineDocumentAdd className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
              File Manage
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Add new files, view records and compare with MICADA data
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col overflow-hidden px-3 sm:px-5 lg:px-6 pt-4 sm:pt-5 min-h-0">
        <div className="flex flex-col flex-1 overflow-hidden min-h-0">

          {/* Tabs */}
          <div className="flex-none overflow-x-auto scrollbar-none">
            <div className="flex gap-0 border-b-2 border-slate-200 min-w-max">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-0.5 transition-colors cursor-pointer whitespace-nowrap
                      ${activeTab === tab.key
                        ? "text-green-700 border-green-600 bg-green-50/50"
                        : "text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto min-h-0 pt-4 sm:pt-5">
            {activeTab === "add"        && <AddNewFile />}
            {activeTab === "records"    && <FileRecord />}
            {activeTab === "comparison" && <MicadaComparison />}
          </div>

        </div>
      </div>
    </div>
  );
}

export default NewFile;