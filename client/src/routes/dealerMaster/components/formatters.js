export const fmt = (n) =>
   n == null ? '—' : new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);

export const fmtCur = (n) =>
   n == null ? '—' : '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);

export const fmtAcre = (n) => (n == null ? '—' : fmt(n) + ' ac');
