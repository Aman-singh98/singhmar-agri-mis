import { createContext, useContext, useState } from "react";

const DateRangeContext = createContext(null);

export const DateRangeProvider = ({ children }) => {
  const [startDate, setStartDate] = useState(null); // dayjs | null
  const [endDate,   setEndDate]   = useState(null); // dayjs | null

  /* ── Filter any file array by createdAt within the selected range ── */
  const filterByRange = (files = []) => {
    if (!startDate && !endDate) return files; // no filter — return all

    return files.filter((file) => {
      if (!file.createdAt) return false;
      const fileDate = new Date(file.createdAt);

      const start = startDate ? startDate.toDate() : null;
      const end   = endDate
        ? new Date(endDate.toDate().setHours(23, 59, 59, 999))
        : null;

      if (start && end)   return fileDate >= start && fileDate <= end;
      if (start && !end)  return fileDate >= start;
      if (!start && end)  return fileDate <= end;
      return true;
    });
  };

  const clearRange = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const isFiltering = !!(startDate || endDate);

  return (
    <DateRangeContext.Provider
      value={{
        startDate, setStartDate,
        endDate,   setEndDate,
        filterByRange,
        clearRange,
        isFiltering,
      }}
    >
      {children}
    </DateRangeContext.Provider>
  );
};

export const useDateRange = () => {
  const ctx = useContext(DateRangeContext);
  if (!ctx) throw new Error("useDateRange must be used inside <DateRangeProvider>");
  return ctx;
};