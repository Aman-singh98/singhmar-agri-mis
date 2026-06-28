/**
 * useDealerMaster.js
 * Hook for fetching dealer master data from /api/hisab/* routes.
 *
 * Usage:
 *   import { useDealerMaster } from '../../hooks/useDealerMaster';
 *   const { rows, summary, loading, error, fetchRows, fetchSummary } = useDealerMaster();
 */

import { useState, useCallback } from 'react';
import api from '../api/axios';

const BASE = '/hisab';

async function apiFetch(url) {
   const res = await api.get(url);
   const json = res.data;
   if (!json.success) throw new Error(json.message || 'Unknown error');
   return json.data;
}

export function useDealerMaster() {
   const [rows, setRows] = useState([]);
   const [summary, setSummary] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   /**
    * fetchRows — loads farmer-level rows
    * @param {{ financialYear: string, dealerName?: string }} params
    */
   const fetchRows = useCallback(async ({ financialYear, dealerName } = {}) => {
      if (!financialYear) return;
      setLoading(true);
      setError(null);
      try {
         const qs = new URLSearchParams({ financialYear });
         if (dealerName) qs.set('dealerName', dealerName);

         const data = await apiFetch(`${BASE}/all-dealers?${qs}`);
         setRows(Array.isArray(data) ? data : []);
      } catch (err) {
         setError(err.message);
         setRows([]);
      } finally {
         setLoading(false);
      }
   }, []);

   /**
    * fetchSummary — loads dealer-level aggregated summary
    * FIX #7 + #8: added setLoading and proper error surfacing
    * @param {{ financialYear: string, dealerName?: string }} params
    */
   const fetchSummary = useCallback(async ({ financialYear, dealerName } = {}) => {
      if (!financialYear) return;
      setLoading(true);        // FIX #8: was missing
      setError(null);
      try {
         const qs = new URLSearchParams({ financialYear });
         if (dealerName) qs.set('dealerName', dealerName);

         const data = await apiFetch(`${BASE}/all-dealers?${qs}`);
         const raw = Array.isArray(data) ? data : [];

         // Group rows by dealerName to build summary objects
         const map = {};
         raw.forEach((r) => {
            const key = r.farmerDealerCode;
            if (!map[key]) {
               map[key] = {
                  dealerName: r.dealerName || key,
                  farmerDealerCode: key,
                  totalFarmers: 0,
                  miniAcresTotal: 0,
                  dripAcresTotal: 0,
                  hdpeAcresTotal: 0,
                  billValueTotal: 0,
                  gstTotal: 0,
                  netAmountTotal: 0,
                  subsidyTotal: 0,
                  fsDepositedTotal: 0,
                  cashPaidTotal: 0,
                  tdsAmountTotal: 0,
                  netBalanceTotal: 0,
                  challanPending: 0,
                  fy: financialYear,
               };
            }
            const s = map[key];
            s.totalFarmers += 1;
            s.miniAcresTotal += r.miniAcresDispatched || 0;
            s.dripAcresTotal += r.dripAcresDispatched || 0;
            s.hdpeAcresTotal += r.hdpeAcresDispatched || 0;
            s.billValueTotal += r.billValue || 0;
            s.gstTotal += r.gstAmount || 0;
            s.netAmountTotal += r.netAmount || 0;
            s.subsidyTotal += r.subsidyReceived || 0;
            s.fsDepositedTotal += r.farmerShareDeposited || 0;
            s.cashPaidTotal += r.cashPaid || 0;
            s.tdsAmountTotal += r.tdsAmount || 0;
            s.netBalanceTotal += r.netBalance || 0;
            if (r.challanStatus && r.challanStatus.toLowerCase().includes('pending')) {
               s.challanPending += 1;
            }
         });

         setSummary(Object.values(map));
      } catch (err) {
         setError(err.message);   // FIX #7: was swallowed silently
         setSummary([]);
      } finally {
         setLoading(false);       // FIX #8: was missing
      }
   }, []);

   /**
    * fetchDealerDetail — full hisab for one dealer (Tab 2 / detail view)
    * @param {{ farmerDealerCode: string, financialYear: string }} params
    * @returns {Promise<object>}
    */
   const fetchDealerDetail = useCallback(async ({ farmerDealerCode, financialYear }) => {
      const qs = new URLSearchParams({ financialYear });
      return apiFetch(`${BASE}/dealer/${encodeURIComponent(farmerDealerCode)}?${qs}`);
   }, []);

   /**
    * getPdfUrl — returns the URL for the dealer PDF download
    * @param {{ farmerDealerCode: string, financialYear: string }} params
    * @returns {string}
    */
   const getPdfUrl = useCallback(({ farmerDealerCode, financialYear }) => {
      const qs = new URLSearchParams({ financialYear });
      return `${BASE}/dealer/${encodeURIComponent(farmerDealerCode)}/pdf?${qs}`;
   }, []);

   return {
      rows,
      summary,
      loading,
      error,
      fetchRows,
      fetchSummary,
      fetchDealerDetail,
      getPdfUrl,
   };
}
