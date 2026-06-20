import type { LoanResult } from "../utils/finance";

type Props = {
  result: LoanResult;
  title: string;
};

const AnalyticsCharts = ({ result, title }: Props) => {
  const principalTotal = result.yearlyBreakdown.reduce((acc, year) => acc + year.principal, 0);
  const interestTotal = result.yearlyBreakdown.reduce((acc, year) => acc + year.interest, 0);

  return (
    <div className="analytics-panel glass-panel">
      <div className="panel-title">{title}</div>
      <div className="charts-row">
        <div className="pie-chart glass-panel">
          <div className="chart-title">Principal vs Interest</div>
          <div className="chart-bar">
            <div className="pie-segment principal" style={{ width: `${Math.max(10, (principalTotal / (principalTotal + interestTotal)) * 100)}%` }} />
            <div className="pie-segment interest" style={{ width: `${Math.max(10, (interestTotal / (principalTotal + interestTotal)) * 100)}%` }} />
          </div>
          <div className="chart-legend">
            <span><span className="legend-dot principal" />Principal</span>
            <span><span className="legend-dot interest" />Interest</span>
          </div>
        </div>
        <div className="bar-chart glass-panel">
          <div className="chart-title">Yearly Repayment Breakdown</div>
          <div className="year-bars">
            {result.yearlyBreakdown.map((yearItem) => {
              const total = yearItem.principal + yearItem.interest;
              const principalPct = total ? (yearItem.principal / total) * 100 : 0;
              return (
                <div key={yearItem.year} className="year-row">
                  <div className="year-label">Year {yearItem.year}</div>
                  <div className="year-bar-bg">
                    <div className="year-bar principal" style={{ width: `${principalPct}%` }} />
                    <div className="year-bar interest" style={{ width: `${100 - principalPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
