export function todayString(): string {
  // "YYYY-MM-DD" in local time (sv-SE locale produces ISO-like date)
  return new Date().toLocaleDateString('sv-SE');
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 86_400_000;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

export function computeNextStreak(
  lastDate: string | null,
  currentStreak: number,
  today: string,
): { streak: number; changed: boolean } {
  if (lastDate === today) return { streak: currentStreak, changed: false };
  if (!lastDate) return { streak: 1, changed: true };
  const diff = daysBetween(lastDate, today);
  if (diff === 1) return { streak: currentStreak + 1, changed: true };
  return { streak: 1, changed: true };
}
