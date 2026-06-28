/**
 * financialYear.routes.js
 * Routes: GET / | POST / | DELETE /:year
 */

import { Router } from "express";
import { createYear, fetchAllYears, removeYear } from "../controllers/financialYear.js";

const router = Router();

router.get("/", fetchAllYears);
router.post("/", createYear);
router.delete("/:year", removeYear);

export default router;
