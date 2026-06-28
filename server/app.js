import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import upload from './routes/upload.js';
import dealerMeta from './routes/dealerMeta.js';
import downloadPdf from "./routes/downloadPdf.js";
import manualEntry from "./routes/manualEntry.js";
import financialYearRoutes from './routes/financialYear.js';
import micadaRoutes from './routes/micada.js';
import mainFileRoutes from './routes/mainFile.js';
import dataManagerRoutes from './routes/DataManager.js';
import hisabRoutes from "./routes/hisabroutes.js";
import itemRates from "./routes/ItemRates.js";
import shiftingEntryRoutes from "./routes/shiftingEntry.js";
import returnEntryRouter from "./routes/returnEntry.js";
import dealerItemRateRouter from "./routes/dealerItemRate.js";
import downloadExcelRouter from './routes/downloadExcel.js';
import mainFYRoutes from './routes/mainFY.js';
import farmerShareDetailsRoutes from './routes/farmerShareDetailsRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express()

app.use(cors());

// ✅ Increase limit here — BEFORE all routes
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use("/api/item-rates", itemRates);
app.use('/api', upload);
app.use('/api', manualEntry);
app.use('/api/dealers', dealerMeta);
app.use("/api/download", downloadPdf);
app.use("/api/financial-years", financialYearRoutes);
app.use("/api", micadaRoutes);
app.use("/api", mainFileRoutes);
app.use("/api/data", dataManagerRoutes);
app.use("/api/hisab", hisabRoutes);
app.use("/api/shifting-entry", shiftingEntryRoutes);
app.use("/api/return-entry", returnEntryRouter);
app.use("/api/dealer-item-rates", dealerItemRateRouter);
app.use('/api/download', downloadExcelRouter);
app.use('/api', mainFYRoutes);
app.use('/api', farmerShareDetailsRoutes);
app.use('/api/users', userRoutes);


export default app;
