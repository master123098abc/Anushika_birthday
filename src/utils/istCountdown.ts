export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  targetYear: number;
  isBirthdayToday: boolean;
  isBirthdayMode: boolean;
}

// India Standard Time (Asia/Kolkata) is strictly UTC+05:30 all year round (no DST).
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export function getISTCountdown(
  birthdayMonth: number,
  birthdayDay: number,
  forceBirthdayMode = false,
  nowMs: number = Date.now()
): CountdownState {
  // Shift UTC clock by +5h30m so UTC getters yield exact IST calendar fields.
  const istNow = new Date(nowMs + IST_OFFSET_MS);
  const istYear = istNow.getUTCFullYear();
  const istMonth = istNow.getUTCMonth() + 1;
  const istDay = istNow.getUTCDate();

  const isBirthdayToday = istMonth === birthdayMonth && istDay === birthdayDay;

  if (isBirthdayToday || forceBirthdayMode) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      targetYear: istYear,
      isBirthdayToday,
      isBirthdayMode: true,
    };
  }

  // Compute 00:00:00 IST on this year's birthday in UTC milliseconds.
  const thisYearTargetUtcMs =
    Date.UTC(istYear, birthdayMonth - 1, birthdayDay, 0, 0, 0, 0) - IST_OFFSET_MS;

  let targetYear = istYear;
  let targetUtcMs = thisYearTargetUtcMs;

  // If Dec 14 of the current IST year has already passed, pick next year automatically.
  if (nowMs >= thisYearTargetUtcMs) {
    targetYear = istYear + 1;
    targetUtcMs =
      Date.UTC(targetYear, birthdayMonth - 1, birthdayDay, 0, 0, 0, 0) - IST_OFFSET_MS;
  }

  const diffMs = Math.max(0, targetUtcMs - nowMs);
  const totalSeconds = Math.floor(diffMs / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    targetYear,
    isBirthdayToday: false,
    isBirthdayMode: false,
  };
}

export function padTwo(value: number): string {
  return String(value).padStart(2, '0');
}
