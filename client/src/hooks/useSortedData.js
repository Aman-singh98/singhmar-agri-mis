import { useState, useMemo } from "react";

/**
 * useSortedData
 * Returns [sortedData, sort, toggleSort]
 *
 * @param {Array}  data         - raw array to sort
 * @param {string} defaultCol   - initial sort column key
 * @param {string} defaultDir   - "asc" | "desc"
 */
const useSortedData = (data, defaultCol = null, defaultDir = "asc") => {
   const [sort, setSort] = useState({ col: defaultCol, dir: defaultDir });

   const toggleSort = (col) =>
      setSort((prev) => ({
         col,
         dir: prev.col === col && prev.dir === "asc" ? "desc" : "asc",
      }));

   const sorted = useMemo(() => {
      if (!sort.col || !data?.length) return data ?? [];
      return [...data].sort((a, b) => {
         const av = a[sort.col];
         const bv = b[sort.col];
         const cmp =
            typeof av === "number"
               ? av - bv
               : String(av ?? "").localeCompare(String(bv ?? ""));
         return sort.dir === "asc" ? cmp : -cmp;
      });
   }, [data, sort]);

   return [sorted, sort, toggleSort];
};

export default useSortedData;
