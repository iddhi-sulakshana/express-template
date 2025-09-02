const multipliers: Record<string, number> = {
  ms: 1 / 1000, // convert ms → seconds
  millisecond: 1 / 1000,
  milliseconds: 1 / 1000,
  msec: 1 / 1000,
  msecs: 1 / 1000,

  s: 1,
  sec: 1,
  secs: 1,
  second: 1,
  seconds: 1,

  m: 60,
  min: 60,
  mins: 60,
  minute: 60,
  minutes: 60,

  h: 3600,
  hr: 3600,
  hrs: 3600,
  hour: 3600,
  hours: 3600,

  d: 86400,
  day: 86400,
  days: 86400,

  w: 604800,
  week: 604800,
  weeks: 604800,

  y: 31536000, // 365 days
  yr: 31536000,
  yrs: 31536000,
  year: 31536000,
  years: 31536000,
};

export function parseExpiryToSeconds(input: string): number {
  const trimmed = input.trim();

  // Regex to split number and unit (supports "10d", "10 d", "10 days")
  const match = trimmed.match(/^(\d+)\s*([a-zA-Z]*)$/);

  if (!match) {
    throw new Error(`Invalid expiry format: ${input}`);
  }

  const value = parseInt(match[1], 10);
  const unit = (match[2] || 's').toLowerCase(); // default to seconds if no unit

  const multiplier = multipliers[unit];
  if (multiplier == null) {
    throw new Error(`Unsupported time unit: ${unit}`);
  }

  return Math.floor(value * multiplier);
}
