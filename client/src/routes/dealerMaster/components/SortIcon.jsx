import { ChevronUp, ChevronDown } from 'lucide-react';

function SortIcon({ col, sortKey, sortDir }) {
   if (col !== sortKey) return <ChevronUp size={12} className="text-gray-300" />;
   return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-green-500" />
      : <ChevronDown size={12} className="text-green-500" />;
}

export default SortIcon;
