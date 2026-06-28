
const STYLES = {
   success: "bg-green-100 text-green-700 border border-green-200",
   danger:  "bg-red-100 text-red-700 border border-red-200",
   info:    "bg-blue-100 text-blue-700 border border-blue-200",
   warning: "bg-amber-100 text-amber-700 border border-amber-200",
};

function StatusPill({ type, children }) {
   return (
      <span className={`${STYLES[type] || STYLES.info} text-[10px] font-bold uppercase tracking-wide px-2 py-0.5`}>
         {children}
      </span>
   );
}

export default StatusPill;