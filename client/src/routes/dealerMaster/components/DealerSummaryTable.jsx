import { fmtCur, fmtAcre } from './formatters';

/**
 * DealerSummaryTable
 *
 * Props:
 *   summary: Array from your backend API — same shape as before:
 *   {
 *     dealerName, farmerDealerCode, totalFarmers,
 *     miniAcresTotal, dripAcresTotal, hdpeAcresTotal,
 *     billValueTotal, gstTotal, netAmountTotal,
 *     subsidyTotal, fsDepositedTotal,
 *     cashPaidTotal, tdsAmountTotal,
 *     netBalanceTotal, challanPending,
 *     fy (optional), date (optional)
 *   }
 */

// ── helpers ───────────────────────────────────────────────────────────────────
const dash = (v) => (v === null || v === undefined || v === "") ? "—" : v;

// ── Reusable sub-components ───────────────────────────────────────────────────
const TH = ({ children, align = "left" }) => (
  <th
    style={{
      padding: "3px 8px",
      textAlign: align,
      fontWeight: 700,
      background: "#f0f0f0",
      borderTop: "1px solid #999",
      borderBottom: "1px solid #999",
      whiteSpace: "nowrap",
      fontSize: 12,
    }}
  >
    {children}
  </th>
);

const LedgerRow = ({
  sr = "",
  label,
  value,
  bold = false,
  bg = "",
  italic = false,
  valueBg = "",
  fontSize = 13,
  negative = false,
}) => (
  <tr style={{ background: bg || "transparent" }}>
    <td style={{ padding: "2px 6px", textAlign: "center", width: 38, fontSize }}>
      {sr}
    </td>
    <td style={{ padding: "2px 6px", fontWeight: bold ? 700 : 400, fontSize }}>
      {label}
    </td>
    <td
      style={{
        padding: "2px 6px",
        textAlign: "right",
        fontWeight: bold ? 700 : 400,
        fontStyle: italic ? "italic" : "normal",
        background: valueBg || "transparent",
        fontSize,
        color: negative ? "#c00000" : "inherit",
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </td>
  </tr>
);

const Divider = ({ cols = 3 }) => (
  <tr>
    <td colSpan={cols} style={{ borderTop: "1px solid #aaa", padding: 0 }} />
  </tr>
);

// ── Single dealer card ────────────────────────────────────────────────────────
function DealerCard({ d }) {
  const isNeg = (v) => typeof v === "number" && v < 0;

  return (
    <div
      style={{
        border: "1px solid #aaa",
        marginBottom: 28,
        fontFamily: "'Calibri', 'Segoe UI', sans-serif",
        fontSize: 13,
        background: "#fff",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "380px 1fr",
            minWidth: 860,
          }}
        >

          {/* ══════════════ LEFT — LEDGER PANEL ══════════════ */}
          <div style={{ borderRight: "1px solid #aaa" }}>

            {/* Header */}
            <div style={{ padding: "4px 10px", borderBottom: "1px solid #aaa" }}>
              {d.date && (
                <div style={{ textAlign: "right", color: "#c00", fontWeight: 700, fontSize: 13 }}>
                  {d.date}
                </div>
              )}
              {d.fy && (
                <div style={{ textAlign: "center", fontWeight: 700, fontSize: 15 }}>
                  {d.fy}
                </div>
              )}
              <div style={{ textAlign: "center", fontWeight: 700, fontSize: 22, padding: "4px 0 6px" }}>
                {d.dealerName}
              </div>
            </div>

            {/* Ledger table */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  <TH align="center">Sr. No.</TH>
                  <TH align="left">Description</TH>
                  <TH align="right">Amount</TH>
                </tr>
              </thead>
              <tbody>

                {/* Dispatch summary rows */}
                <LedgerRow
                  label={`Mini Acres${d.fy ? " " + d.fy.replace("F.Y. ", "") : ""}`}
                  value={fmtAcre(d.miniAcresTotal)}
                  bold
                />
                <LedgerRow
                  label={`Drip Acres${d.fy ? " " + d.fy.replace("F.Y. ", "") : ""}`}
                  value={fmtAcre(d.dripAcresTotal)}
                  bold
                />
                <LedgerRow
                  label={`HDPE Acres${d.fy ? " " + d.fy.replace("F.Y. ", "") : ""}`}
                  value={fmtAcre(d.hdpeAcresTotal)}
                  bold
                />
                <LedgerRow
                  label="Total Farmers"
                  value={dash(d.totalFarmers)}
                  bold
                />

                {/* Total A — Cost side */}
                <LedgerRow sr="1" label="Bill Value"  value={fmtCur(d.billValueTotal)} />
                <LedgerRow sr="2" label="GST"         value={fmtCur(d.gstTotal)} />
                <LedgerRow sr="3" label="Net Amount"  value={fmtCur(d.netAmountTotal)} />
                <Divider />
                <LedgerRow
                  label="Total A"
                  value={fmtCur(d.billValueTotal)}
                  bold
                />

                {/* Total B — Receipt side */}
                <LedgerRow sr="4" label="Subsidy Received"  value={fmtCur(d.subsidyTotal)} />
                <LedgerRow sr="5" label="FS Deposited"      value={fmtCur(d.fsDepositedTotal)} />
                <Divider />
                <LedgerRow
                  label="Total B"
                  value={fmtCur(
                    (d.subsidyTotal || 0) + (d.fsDepositedTotal || 0)
                  )}
                  bold
                />
                <Divider />
                <LedgerRow
                  label="Balance (A-B)"
                  value={fmtCur(
                    (d.billValueTotal || 0) -
                    ((d.subsidyTotal || 0) + (d.fsDepositedTotal || 0))
                  )}
                  bold
                  negative={
                    (d.billValueTotal || 0) -
                    ((d.subsidyTotal || 0) + (d.fsDepositedTotal || 0)) < 0
                  }
                />

                {/* Payments */}
                <LedgerRow sr="6"  label="TDS Amount"  value={fmtCur(d.tdsAmountTotal)} />
                <LedgerRow
                  sr="7"
                  label="Cash Paid"
                  value={
                    <span style={{ background: "#c0c0c0", padding: "0 4px", display: "block" }}>
                      {fmtCur(d.cashPaidTotal)}
                    </span>
                  }
                />

                <Divider />
                <LedgerRow
                  label="Net Balance"
                  value={fmtCur(d.netBalanceTotal)}
                  bold
                  italic
                  fontSize={15}
                  negative={isNeg(d.netBalanceTotal)}
                />
              </tbody>
            </table>
          </div>

          {/* ══════════════ RIGHT — SUMMARY PANEL ══════════════ */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "10px 12px",
            }}
          >
            {/* Spacer to match left header height */}
            <div style={{ height: d.date || d.fy ? 92 : 60 }} />

            {/* Acres breakdown table */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  <TH align="left">Type</TH>
                  <TH align="right">Acres</TH>
                  <TH align="right">Bill Value</TH>
                  <TH align="right">GST</TH>
                  <TH align="right">Net Amount</TH>
                  <TH align="right">Subsidy</TH>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "3px 8px" }}>Mini</td>
                  <td style={{ padding: "3px 8px", textAlign: "right" }}>{fmtAcre(d.miniAcresTotal)}</td>
                  <td style={{ padding: "3px 8px", textAlign: "right" }}>—</td>
                  <td style={{ padding: "3px 8px", textAlign: "right" }}>—</td>
                  <td style={{ padding: "3px 8px", textAlign: "right" }}>—</td>
                  <td style={{ padding: "3px 8px", textAlign: "right" }}>—</td>
                </tr>
                <tr>
                  <td style={{ padding: "3px 8px" }}>Drip</td>
                  <td style={{ padding: "3px 8px", textAlign: "right" }}>{fmtAcre(d.dripAcresTotal)}</td>
                  <td style={{ padding: "3px 8px", textAlign: "right" }}>—</td>
                  <td style={{ padding: "3px 8px", textAlign: "right" }}>—</td>
                  <td style={{ padding: "3px 8px", textAlign: "right" }}>—</td>
                  <td style={{ padding: "3px 8px", textAlign: "right" }}>—</td>
                </tr>
                <tr>
                  <td style={{ padding: "3px 8px" }}>HDPE</td>
                  <td style={{ padding: "3px 8px", textAlign: "right" }}>{fmtAcre(d.hdpeAcresTotal)}</td>
                  <td style={{ padding: "3px 8px", textAlign: "right" }}>—</td>
                  <td style={{ padding: "3px 8px", textAlign: "right" }}>—</td>
                  <td style={{ padding: "3px 8px", textAlign: "right" }}>—</td>
                  <td style={{ padding: "3px 8px", textAlign: "right" }}>—</td>
                </tr>
                <tr style={{ borderTop: "1px solid #aaa" }}>
                  <td style={{ padding: "3px 8px", fontWeight: 700 }}>Total</td>
                  <td style={{ padding: "3px 8px", textAlign: "right", fontWeight: 700 }}>
                    {fmtAcre((d.miniAcresTotal || 0) + (d.dripAcresTotal || 0) + (d.hdpeAcresTotal || 0))}
                  </td>
                  <td style={{ padding: "3px 8px", textAlign: "right", fontWeight: 700 }}>{fmtCur(d.billValueTotal)}</td>
                  <td style={{ padding: "3px 8px", textAlign: "right", fontWeight: 700 }}>{fmtCur(d.gstTotal)}</td>
                  <td style={{ padding: "3px 8px", textAlign: "right", fontWeight: 700 }}>{fmtCur(d.netAmountTotal)}</td>
                  <td style={{ padding: "3px 8px", textAlign: "right", fontWeight: 700 }}>{fmtCur(d.subsidyTotal)}</td>
                </tr>
              </tbody>
            </table>

            {/* Bottom-right summary box */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <table style={{ borderCollapse: "collapse", fontSize: 12 }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "3px 10px" }}>FS Deposited</td>
                    <td style={{ padding: "3px 10px", textAlign: "right", minWidth: 110, fontWeight: 500 }}>
                      {fmtCur(d.fsDepositedTotal)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "3px 10px" }}>Cash Paid</td>
                    <td style={{ padding: "3px 10px", textAlign: "right", fontWeight: 500 }}>
                      {fmtCur(d.cashPaidTotal)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "3px 10px" }}>TDS Amount</td>
                    <td style={{ padding: "3px 10px", textAlign: "right", fontWeight: 500 }}>
                      {fmtCur(d.tdsAmountTotal)}
                    </td>
                  </tr>
                  <tr style={{ borderTop: "1px solid #aaa" }}>
                    <td style={{ padding: "4px 10px", fontWeight: 700 }}>Net Balance</td>
                    <td
                      style={{
                        padding: "4px 10px",
                        textAlign: "right",
                        fontWeight: 700,
                        color: isNeg(d.netBalanceTotal) ? "#c00000" : "#166534",
                      }}
                    >
                      {fmtCur(d.netBalanceTotal)}
                    </td>
                  </tr>
                  <tr style={{ borderTop: "1px solid #aaa", background: d.challanPending > 0 ? "#fff3cd" : "#f0fff4" }}>
                    <td style={{ padding: "4px 10px", fontWeight: 700 }}>Challan Pending</td>
                    <td style={{ padding: "4px 10px", textAlign: "right", fontWeight: 700 }}>
                      {d.challanPending > 0 ? (
                        <span
                          style={{
                            background: "#fef3c7",
                            color: "#92400e",
                            border: "1px solid #fcd34d",
                            borderRadius: 12,
                            padding: "2px 10px",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {d.challanPending} pending
                        </span>
                      ) : (
                        <span style={{ color: "#16a34a", fontWeight: 700 }}>✓ Clear</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function DealerSummaryTable({ summary = [] }) {
  if (!summary.length) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "48px 24px",
          color: "#6b7280",
          fontFamily: "Calibri, sans-serif",
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 10 }}>📊</div>
        <p style={{ fontWeight: 700, fontSize: 16 }}>No summary data</p>
        <p style={{ fontSize: 13 }}>No dealer summary available for the selected filters.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto", padding: "12px 0" }}>
      {summary.map((d) => (
        // FIX #9: stable key using farmerDealerCode, fallback to dealerName
        <DealerCard key={d.farmerDealerCode || d.dealerName} d={d} />
      ))}
    </div>
  );
}
