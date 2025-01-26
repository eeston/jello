import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";

export const secondsToTicks = (seconds: number): number => {
  if (typeof seconds !== "number" || isNaN(seconds)) {
    return 0;
  }
  return Math.floor(seconds * 10000000);
};

export const ticksToSeconds = (ticks: BaseItemDto["RunTimeTicks"]): number => {
  if (typeof ticks !== "number" || isNaN(ticks)) {
    return 0;
  }
  return Math.floor(ticks / 10000000);
};

export const ticksToMins = (ticks: BaseItemDto["RunTimeTicks"]): number => {
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

export const millisToMmSs = (millis: number): string => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
};
