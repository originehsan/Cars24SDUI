/**
 * Pure EMI math — no React/RN imports, unit-testable standalone.
 * Standard reducing-balance EMI formula:
 * EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 */
export function calculateEmi(principal: number, annualRatePercent: number, months: number): number {
  if (months <= 0) return 0;
  const monthlyRate = annualRatePercent / 12 / 100;
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

/** Indian-style comma grouping (1,23,456) without relying on Intl support. */
export function formatIndianNumber(value: number): string {
  const rounded = Math.round(value);
  const str = Math.abs(rounded).toString();
  const lastThree = str.slice(-3);
  const rest = str.slice(0, -3);
  const grouped = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree : lastThree;
  return rounded < 0 ? `-${grouped}` : grouped;
}