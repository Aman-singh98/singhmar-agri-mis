// UserManage.jsx
import { useState } from "react";
import CreateUser from "./CreateUser";
import ManageUsers from "./ManageUsers";


const TABS = [
   { key: "create", label: "Create User" },
   { key: "manage", label: "User Manage" },
];

function UserManage() {
   const [activeTab, setActiveTab] = useState("create");

   return (
      <div className="flex flex-col h-full overflow-hidden bg-slate-50 font-sans">

         {/* ── Page Header ─────────────────────────────────────────────── */}
         <div className="flex-none bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-7 py-3 sm:py-4">
            <div>
               <div className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
                  👤 User Manage
               </div>
               <div className="text-xs text-slate-400 mt-0.5">
                  Create new admin/employee accounts and manage existing users
               </div>
            </div>
         </div>

         {/* ── Body ────────────────────────────────────────────────────── */}
         <div className="flex-1 flex flex-col overflow-hidden px-3 sm:px-5 lg:px-6 pt-4 sm:pt-5 min-h-0">
            <div className="flex flex-col flex-1 overflow-hidden min-h-0">

               {/* ── Tabs ── */}
               <div className="flex-none overflow-x-auto scrollbar-none">
                  <div className="flex gap-0 border-b-2 border-slate-200 min-w-max">
                     {TABS.map((tab) => (
                        <button
                           key={tab.key}
                           type="button"
                           onClick={() => setActiveTab(tab.key)}
                           className={`px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-0.5 transition-colors cursor-pointer whitespace-nowrap
                              ${activeTab === tab.key
                                 ? "text-green-700 border-green-600"
                                 : "text-slate-400 border-transparent hover:text-slate-600"
                              }`}
                        >
                           {tab.label}
                        </button>
                     ))}
                  </div>
               </div>

               {/* ── Tab Content ── */}
               <div className="flex-1 overflow-y-auto min-h-0 pt-4 sm:pt-5">
                  {activeTab === "create" && <CreateUser />}
                  {activeTab === "manage" && <ManageUsers />}
               </div>

            </div>
         </div>
      </div>
   );
}

export default UserManage;