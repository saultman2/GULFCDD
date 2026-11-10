/** Paid calendar-month periods, not raw invoice count or a manually edited status. */
export function countPaidPeriods(periods: { start: number; end: number }[], now = Date.now() / 1000) {
  const sorted = [...periods].sort((a, b) => a.start - b.start);
  const seen = new Set<number>();
  let months = 0, lastEnd = 0, ownershipEligible = false;
  for (const period of sorted) {
    const days = (period.end - period.start) / 86400;
    if (seen.has(period.start) || days < 27 || days > 32) continue;
    seen.add(period.start);
    if (lastEnd && period.start > lastEnd + 60) months = 0;
    months++;
    lastEnd = period.end;
    // Six consecutive paid service months must actually elapse.
    if (months >= 6 && period.end <= now) ownershipEligible = true;
  }
  return { paidMonths: months, ownershipEligible };
}
