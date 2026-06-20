export type LoanInput = {
  name: string;
  amount: number;
  annualRate: number;
  tenureMonths: number;
  extraPayment?: number;
};

export type AmortizationRow = {
  month: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
};

export type LoanResult = {
  monthlyEMI: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: AmortizationRow[];
  yearlyBreakdown: { year: number; principal: number; interest: number; balance: number }[];
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

export const calculateEMI = (amount: number, annualRate: number, months: number): number => {
  if (!amount || !annualRate || !months) return 0;
  const monthlyRate = annualRate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, months);
  return (amount * monthlyRate * factor) / (factor - 1);
};

export const generateLoanResult = (input: LoanInput): LoanResult => {
  const monthlyEMI = calculateEMI(input.amount, input.annualRate, input.tenureMonths);
  let balance = input.amount;
  const schedule: AmortizationRow[] = [];
  const yearlyMap = new Map<number, { principal: number; interest: number; balance: number }>();
  const monthlyRate = input.annualRate / 12 / 100;

  for (let month = 1; month <= input.tenureMonths; month += 1) {
    const interestPaid = balance * monthlyRate;
    const principalPaid = Math.max(monthlyEMI - interestPaid, 0);
    balance = Math.max(balance - principalPaid - (input.extraPayment || 0), 0);
    schedule.push({
      month,
      emi: monthlyEMI + (input.extraPayment || 0),
      principalPaid,
      interestPaid,
      remainingBalance: balance,
    });

    const year = Math.ceil(month / 12);
    const yearEntry = yearlyMap.get(year) ?? { principal: 0, interest: 0, balance: 0 };
    yearEntry.principal += principalPaid;
    yearEntry.interest += interestPaid;
    yearEntry.balance = balance;
    yearlyMap.set(year, yearEntry);

    if (balance <= 0) break;
  }

  const totalPayment = schedule.reduce((acc, row) => acc + row.emi, 0);
  const totalInterest = schedule.reduce((acc, row) => acc + row.interestPaid, 0);

  return {
    monthlyEMI,
    totalPayment,
    totalInterest,
    amortizationSchedule: schedule,
    yearlyBreakdown: Array.from(yearlyMap.entries()).map(([year, data]) => ({
      year,
      principal: data.principal,
      interest: data.interest,
      balance: data.balance,
    })),
  };
};

export const calculateComparison = (loanA: LoanInput, loanB: LoanInput) => {
  const a = generateLoanResult(loanA);
  const b = generateLoanResult(loanB);
  const savings = Math.max(0, Math.min(a.totalPayment, b.totalPayment) - Math.max(a.totalPayment, b.totalPayment));
  const cheaper = a.totalPayment < b.totalPayment ? loanA.name : loanB.name;
  const percentageSavings = Math.abs((a.totalPayment - b.totalPayment) / Math.max(a.totalPayment, b.totalPayment)) * 100;

  return {
    loanA: a,
    loanB: b,
    cheaper,
    savings: Math.abs(a.totalPayment - b.totalPayment),
    percentageSavings: Number(percentageSavings.toFixed(2)),
  };
};
