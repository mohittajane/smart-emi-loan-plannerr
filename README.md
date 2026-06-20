# Smart EMI & Loan Planner

A modern React + Vite web application for calculating EMI, comparing loan options, visualizing repayment schedules, and estimating affordability.

## Features

- EMI calculator with loan amount, interest rate, tenure, and prepayment support.
- Total interest and total payable calculation.
- Compare two loan options side-by-side.
- Shows savings and percentage difference between loan options.
- Amortization schedule with principal, interest, EMI, and remaining balance.
- Analytics with principal vs interest visualization and yearly repayment breakdown.
- Loan eligibility indicator based on income.
- Light/Dark theme toggle.
- Premium glassmorphism dashboard UI.
- Mobile responsive and accessible.

## Project Structure

- `src/App.tsx` — main dashboard and loan planning page.
- `src/components/` — reusable UI components.
- `src/utils/finance.ts` — EMI and amortization logic.
- `src/styles.css` — global styling and theme.

## Run Locally

1. Install dependencies

```bash
npm install
```

2. Start development server

```bash
npm run dev
```

3. Build production files

```bash
npm run build
```

4. Preview production build

```bash
npm run preview
```

## Deployment

This project is ready to deploy on Vercel.

1. Push the repository to GitHub.
2. Import the repo in Vercel.
3. Use the default Vite settings.
4. Vercel will build using `npm run build` and serve the output.

## GitHub Upload Commands

```bash
git init
git add .
git commit -m "chore: add Smart EMI & Loan Planner React app"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

## About Project

I created this tool because EMI and loan calculations are commonly used before purchasing products, vehicles, or planning finances.

## Notes

- The EMI formula is accurate and uses monthly compounding.
- The app is designed with a polished dashboard experience.
- Replace `your-email@example.com` with the real email before publishing.
