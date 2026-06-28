import StockDispatched from '../../models/ItemsStockDispatched.js';
import {
   parseStockDispatchedSheet,
} from '../../utils/agriDataParsers.js';

// POST /api/upload/items_stock — ITEMS Stock 22-23
export async function uploadItems(req, res) {
   if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

   const { financialYear } = req.body;
   if (!financialYear) return res.status(400).json({ error: 'financialYear is required.' });

   try {
      const records = parseStockDispatchedSheet(req.file.buffer, financialYear);
      await StockDispatched.deleteMany({ financialYear });
      await StockDispatched.insertMany(records);
      return res.json({
         message: 'Items Stock upload complete.',
         collection: 'stock_dispatched',
         inserted: records.length,
      });
   } catch (err) {
      return res.status(500).json({ error: err.message });
   }
}