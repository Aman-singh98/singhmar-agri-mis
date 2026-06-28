export function extractFYFromMINumber(miNumber) {
   if (!miNumber) return null;
   const value = String(miNumber).trim().toUpperCase();
   const match = value.match(/^MI(\d{2})(\d{2})/);
   if (!match) return null;
   const startYear = match[1];
   const endYear = match[2];
   return `20${startYear}-${endYear}`;

}