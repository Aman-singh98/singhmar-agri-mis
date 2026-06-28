/**
 * useFinancialYears.js
 */

import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

export function useFinancialYears() {
   const [years, setYears] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   const fetchYears = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
         const res = await api.get("/financial-years");
         setYears(res.data.data);
      } catch (err) {
         setError(err.response?.data?.message || "Failed to load financial years.");
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => { fetchYears(); }, [fetchYears]);

   async function addYear(value) {
      try {
         await api.post("/financial-years", { year: value.trim() });
         await fetchYears();
         return { error: null };
      } catch (err) {
         return { error: err.response?.data?.message || "Network error. Please try again." };
      }
   }

   async function deleteYear(value) {
      try {
         await api.delete(`/financial-years/${encodeURIComponent(value)}`);
         await fetchYears();
         return { error: null };
      } catch (err) {
         return { error: err.response?.data?.message || "Network error. Please try again." };
      }
   }

   return { years, loading, error, addYear, deleteYear, refetch: fetchYears };
}
