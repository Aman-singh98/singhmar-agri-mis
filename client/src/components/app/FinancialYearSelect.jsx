
import { useFinancialYears } from "../../hooks/useFinancialYears";

function FinancialYearSelect({ value, onChange, disabled }) {
   const { years } = useFinancialYears();

   return (
      <select
         value={value}
         onChange={onChange}
         disabled={disabled}
         className="px-3 py-2 border border-gray-300 text-sm bg-white text-black cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-600
            disabled:opacity-50 disabled:cursor-not-allowed transition w-full"
      >
         <option value="">Select year</option>
         {years.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
   );
}

export default FinancialYearSelect;