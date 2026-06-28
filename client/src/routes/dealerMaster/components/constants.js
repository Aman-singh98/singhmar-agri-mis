import { fmtAcre, fmtCur } from './formatters';

export const PAGE_SIZE = 15;
export const tabs = ["Summary", "Detail", "Farmers",];

export const COLS = [
   { key: 'farmerDealerCode', label: 'Code', width: 'w-28' },
   { key: 'farmerName', label: 'Farmer', width: 'w-44' },
   { key: 'irrigationType', label: 'Type', width: 'w-28' },
   { key: 'miNumber', label: 'MI No.', width: 'w-28' },
   { key: 'totalAcresDispatched', label: 'Disp. Acres', width: 'w-28', render: fmtAcre },
   { key: 'billedAcres', label: 'Billed Ac.', width: 'w-24', render: fmtAcre },
   { key: 'billValue', label: 'Bill Value', width: 'w-32', render: fmtCur },
   { key: 'gstAmount', label: 'GST', width: 'w-28', render: fmtCur },
   { key: 'netAmount', label: 'Net Amt.', width: 'w-32', render: fmtCur },
   { key: 'subsidyAmount85Pct', label: 'Subsidy 85%', width: 'w-32', render: fmtCur },
   { key: 'farmerShareAmount', label: 'FS Amt.', width: 'w-28', render: fmtCur },
   { key: 'farmerShareDeposited', label: 'FS Dep.', width: 'w-28', render: fmtCur },
   { key: 'fsOutstanding', label: 'FS O/S', width: 'w-28', render: fmtCur },
   { key: 'cashPaid', label: 'Cash Paid', width: 'w-28', render: fmtCur },
   { key: 'netBalance', label: 'Net Balance', width: 'w-32', render: fmtCur },
   { key: 'verificationStatus', label: 'Status', width: 'w-28' },
   { key: 'village', label: 'Village', width: 'w-32' },
   { key: 'district', label: 'District', width: 'w-28' }
];
