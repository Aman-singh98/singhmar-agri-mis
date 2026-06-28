import express from "express";
import {
   getAllEntries,
   getEntryById,
   createEntry,
   updateEntry,
   deleteEntry,
} from "../controllers/shiftingEntry.js";

const router = express.Router();

router.get("/", getAllEntries);
router.get("/:id", getEntryById);
router.post("/", createEntry);
router.put("/:id", updateEntry);
router.delete("/:id", deleteEntry);

export default router;