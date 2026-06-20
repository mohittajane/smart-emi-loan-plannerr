import type { AmortizationRow } from "../utils/finance";

type Props = {
  schedule: AmortizationRow[];
};

const ScheduleTable = ({ schedule }: Props) => {
  return (
    <div className="schedule-table glass-panel">
      <div className="table-header">Amortization Schedule</div>
      <div className="schedule-grid">
        <div>Month</div>
        <div>EMI</div>
        <div>Principal</div>
        <div>Interest</div>
        <div>Balance</div>
      </div>
      {schedule.map((row) => (
        <div key={row.month} className="schedule-row">
          <span>{row.month}</span>
          <span>{row.emi.toFixed(0)}</span>
          <span>{row.principalPaid.toFixed(0)}</span>
          <span>{row.interestPaid.toFixed(0)}</span>
          <span>{row.remainingBalance.toFixed(0)}</span>
        </div>
      ))}
    </div>
  );
};

export default ScheduleTable;
