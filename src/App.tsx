import { useMemo, useState } from "react";
import InputCard from "./components/InputCard";
import StatCard from "./components/StatCard";
import ScheduleTable from "./components/ScheduleTable";
import AnalyticsCharts from "./components/AnalyticsCharts";
import { calculateComparison, formatCurrency, generateLoanResult, LoanInput } from "./utils/finance";

const defaultLoan: LoanInput = {
  name: "Option A",
  amount: 1000000,
  annualRate: 8.5,
  tenureMonths: 120,
  extraPayment: 0,
};

const defaultLoanB: LoanInput = {
  name: "Option B",
  amount: 1000000,
  annualRate: 9.2,
  tenureMonths: 96,
  extraPayment: 0,
};

const App = () => {
  const [theme, setTheme] = useState("light");
  const [loanA, setLoanA] = useState(defaultLoan);
  const [loanB, setLoanB] = useState(defaultLoanB);
  const [income, setIncome] = useState(80000);
  const [prepay, setPrepay] = useState(2000);
  const [loanAmount, setLoanAmount] = useState(loanA.amount);
  const [loanRate, setLoanRate] = useState(loanA.annualRate);
  const [loanTenure, setLoanTenure] = useState(loanA.tenureMonths);

  const currentLoan = useMemo(
    () => generateLoanResult({ ...loanA, amount: loanAmount, annualRate: loanRate, tenureMonths: loanTenure, extraPayment: prepay }),
    [loanAmount, loanRate, loanTenure, loanA, prepay],
  );

  const baselineLoan = useMemo(
    () => generateLoanResult({ ...loanA, amount: loanAmount, annualRate: loanRate, tenureMonths: loanTenure, extraPayment: 0 }),
    [loanAmount, loanRate, loanTenure, loanA],
  );

  const comparison = useMemo(() => calculateComparison(loanA, loanB), [loanA, loanB]);
  const affordability = useMemo(() => {
    const maxAllowable = income * 0.5;
    return {
      maxAllowable,
      status: currentLoan.monthlyEMI <= maxAllowable ? "Eligible" : "Review budget",
    };
  }, [income, currentLoan.monthlyEMI]);

  const prepaymentSavings = Math.max(0, baselineLoan.totalInterest - currentLoan.totalInterest);

  const savingsLabel = comparison.loanA.totalPayment < comparison.loanB.totalPayment ? loanA.name : loanB.name;
  const savingsValue = comparison.savings;

  const handleInputChange = (setter: (value: number) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setter(Number(event.target.value));
  };

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <div className={`app-shell ${theme}`}>
      <header className="hero-panel glass-panel">
        <div>
          <p className="eyebrow">Smart EMI & Loan Planner</p>
          <h1>Build the smartest financial roadmap for your next purchase.</h1>
          <p className="hero-copy">
            Plan EMIs, compare loan options, estimate affordability, and visualize repayment with confidence. Designed for modern finance decisions.
          </p>
          <div className="hero-actions">
            <a href="https://digitalheroesco.com" className="primary-btn" target="_blank" rel="noreferrer">
              Built for Digital Heroes
            </a>
            <button type="button" className="ghost-btn" onClick={toggleTheme}>
              {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            </button>
          </div>
        </div>
        <div className="hero-stats glass-panel">
          <div className="hero-card">
            <span>Total EMI</span>
            <strong>{formatCurrency(currentLoan.monthlyEMI)}</strong>
          </div>
          <div className="hero-card">
            <span>Total Interest</span>
            <strong>{formatCurrency(currentLoan.totalInterest)}</strong>
          </div>
          <div className="hero-card">
            <span>Total Payment</span>
            <strong>{formatCurrency(currentLoan.totalPayment)}</strong>
          </div>
        </div>
      </header>

      <main className="dashboard-grid">
        <section className="panel glass-panel">
          <div className="panel-header">
            <div>
              <h2>Loan & Affordability</h2>
              <p>Calculate EMI, interest, and repayment impact with clear validation.</p>
            </div>
            <span className={`status-pill ${affordability.status === "Eligible" ? "valid" : "warn"}`}>{affordability.status}</span>
          </div>

          <div className="input-grid">
            <InputCard label="Loan Amount" name="loanAmount" value={loanAmount} onChange={handleInputChange(setLoanAmount)} unit="₹" min={10000} step={10000} />
            <InputCard label="Interest Rate" name="loanRate" value={loanRate} onChange={handleInputChange(setLoanRate)} unit="%" min={1} max={25} step={0.1} />
            <InputCard label="Tenure" name="loanTenure" value={loanTenure} onChange={handleInputChange(setLoanTenure)} unit="months" min={6} max={360} step={1} />
            <InputCard label="Income" name="income" value={income} onChange={handleInputChange(setIncome)} unit="₹" min={10000} step={5000} />
            <InputCard label="Prepayment" name="prepay" value={prepay} onChange={handleInputChange(setPrepay)} unit="₹" min={0} step={500} />
          </div>

          <div className="summary-grid">
            <StatCard title="EMI" value={formatCurrency(currentLoan.monthlyEMI)} subtitle="Monthly installment" />
            <StatCard title="Total Interest" value={formatCurrency(currentLoan.totalInterest)} subtitle="Interest over tenure" />
            <StatCard title="Total Payable" value={formatCurrency(currentLoan.totalPayment)} subtitle="EMI + interest" />
            <StatCard title="Affordability" value={formatCurrency(affordability.maxAllowable)} subtitle="50% of income threshold" />
          </div>

          <div className="mini-insights">
            <div className="mini-card">
              <span>Prepayment impact</span>
              <strong>{formatCurrency(prepaymentSavings)} saved in interest</strong>
              <small>using ₹{prepay} extra monthly</small>
            </div>
            <div className="mini-card">
              <span>Eligible EMI limit</span>
              <strong>{formatCurrency(affordability.maxAllowable)}</strong>
              <small>{affordability.status} for selected income</small>
            </div>
          </div>
        </section>

        <section className="panel glass-panel compare-panel">
          <div className="panel-header">
            <div>
              <h2>Loan Comparison</h2>
              <p>Compare two loan plans side-by-side and see savings.</p>
            </div>
          </div>

          <div className="comparison-grid">
            <div className="comparison-card glass-panel">
              <h3>{loanA.name}</h3>
              <div className="comparison-body">
                <InputCard label="Amount" name="amountA" value={loanA.amount} onChange={(e) => setLoanA({ ...loanA, amount: Number(e.target.value) })} unit="₹" min={10000} step={10000} />
                <InputCard label="Rate" name="rateA" value={loanA.annualRate} onChange={(e) => setLoanA({ ...loanA, annualRate: Number(e.target.value) })} unit="%" min={1} step={0.1} />
                <InputCard label="Tenure" name="tenureA" value={loanA.tenureMonths} onChange={(e) => setLoanA({ ...loanA, tenureMonths: Number(e.target.value) })} unit="months" min={6} step={1} />
              </div>
              <div className="comparison-footer">
                <span>EMI</span>
                <strong>{formatCurrency(generateLoanResult(loanA).monthlyEMI)}</strong>
              </div>
            </div>

            <div className="comparison-card glass-panel">
              <h3>{loanB.name}</h3>
              <div className="comparison-body">
                <InputCard label="Amount" name="amountB" value={loanB.amount} onChange={(e) => setLoanB({ ...loanB, amount: Number(e.target.value) })} unit="₹" min={10000} step={10000} />
                <InputCard label="Rate" name="rateB" value={loanB.annualRate} onChange={(e) => setLoanB({ ...loanB, annualRate: Number(e.target.value) })} unit="%" min={1} step={0.1} />
                <InputCard label="Tenure" name="tenureB" value={loanB.tenureMonths} onChange={(e) => setLoanB({ ...loanB, tenureMonths: Number(e.target.value) })} unit="months" min={6} step={1} />
              </div>
              <div className="comparison-footer">
                <span>EMI</span>
                <strong>{formatCurrency(generateLoanResult(loanB).monthlyEMI)}</strong>
              </div>
            </div>
          </div>

          <div className="savings-callout glass-panel">
            <p>
              <strong>{savingsLabel}</strong> saves {formatCurrency(savingsValue)} with {comparison.percentageSavings}% lower total payout.
            </p>
          </div>
        </section>

        <section className="panel glass-panel analytics-panel">
          <div className="panel-header">
            <div>
              <h2>Analytics & Forecast</h2>
              <p>Visualize repayment, principal vs interest, and prepayment effects.</p>
            </div>
          </div>
          <AnalyticsCharts result={currentLoan} title="Your loan analytics" />
        </section>

        <section className="panel glass-panel about-panel">
          <h2>About Project</h2>
          <p>
            I created this tool because EMI and loan calculations are commonly used before purchasing products, vehicles, or planning finances.
          </p>
          <div className="contact-block">
            <div>
              <strong>Name</strong>
              <p>Mohit Ashok Tajane</p>
            </div>
            <div>
              <strong>Email</strong>
              <p>mohittajane@gmail.com</p>
            </div>
          </div>
        </section>

        <section className="panel glass-panel schedule-panel">
          <ScheduleTable schedule={currentLoan.amortizationSchedule.slice(0, 12)} />
        </section>
      </main>
    </div>
  );
};

export default App;
