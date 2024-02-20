export const secondsToTicks = (seconds: number): number => {
  if (typeof seconds !== "number" || isNaN(seconds)) {
    return 0;
  }
  return Math.floor(seconds * 10000000);
};

export const ticksToSeconds = (ticks: number): number => {
  if (typeof ticks !== "number" || isNaN(ticks)) {
    return 0;
  }
  return Math.floor(ticks / 10000000);
};

export const ticksToMins = (ticks: number): number => {
  const seconds = ticksToSeconds(ticks);
  return Math.round(seconds / 60);
};

export const secondsToMmSs = (seconds: number): string => {
  if (typeof seconds !== "number" || isNaN(seconds) || seconds === 0) {
    return "0:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds - minutes * 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
