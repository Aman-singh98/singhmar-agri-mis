/**
 * dealerItemRateService.js
 * API calls for dealer-specific item rate overrides.
 * Base URL: /api/dealer-item-rates
 */

import api from "../../../api/axios";

const BASE = "/dealer-item-rates";

/**
 * Get all overrides for a dealer + financial year
 * GET /dealer-item-rates?dealer=<id>&financialYear=25-26
 */
export const getDealerItemRates = (dealerId, financialYear) =>
   api.get(BASE, { params: { dealer: dealerId, financialYear } });

/**
 * Create a new override
 * POST /dealer-item-rates
 */
export const createDealerItemRate = (data) =>
   api.post(BASE, data);

/**
 * Update an existing override
 * PUT /dealer-item-rates/:id
 */
export const updateDealerItemRate = (id, data) =>
   api.put(`${BASE}/${id}`, data);

/**
 * Delete an override
 * DELETE /dealer-item-rates/:id
 */
export const deleteDealerItemRate = (id) =>
   api.delete(`${BASE}/${id}`);

/**
 * Get all dealers (for the dealer selector)
 * GET /dealers
 */
export const getDealers = () =>
   api.get("/dealers");

/**
 * Get all financial years (for the FY selector)
 * GET /financial-years
 */
export const getFinancialYears = () =>
   api.get("/financial-years");
