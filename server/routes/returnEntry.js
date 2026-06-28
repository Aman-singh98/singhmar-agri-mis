import express from "express";
import {
   getAllReturnEntries,
   getReturnEntryById,
   getReturnEntryByDealer,
   createReturnEntry,
   updateReturnEntry,
   deleteReturnEntry,
} from "../controllers/returnEntry.js";

const router = express.Router();

router.get("/", getAllReturnEntries);
router.get("/dealer/:dealerId", getReturnEntryByDealer);
router.get("/:id", getReturnEntryById);
router.post("/", createReturnEntry);
router.put("/:id", updateReturnEntry);
router.delete("/:id", deleteReturnEntry);

export default router;