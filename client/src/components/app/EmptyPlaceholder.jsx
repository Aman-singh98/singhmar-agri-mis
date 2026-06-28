
function EmptyPlaceholder({ icon = "📭", title, description, action }) {
   return (
      <div className="flex flex-col items-center justify-center py-14 px-6 text-center border border-dashed border-black">
         <span className="text-4xl mb-4 select-none">{icon}</span>
         <p className="text-sm font-semibold text-black mb-1">{title}</p>
         {description && (
            <p className="text-sm text-black max-w-xs">{description}</p>
         )}
         {action && (
            <button
               type="button"
               onClick={action.onClick}
               className="mt-4 px-4 py-1.5 text-sm font-semibold text-black border border-black hover:bg-black hover:text-white transition-colors"
            >
               {action.label}
            </button>
         )}
      </div>
   );
}

export default EmptyPlaceholder;