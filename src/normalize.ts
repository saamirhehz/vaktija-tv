import type { DayVaktija, NormalizedVaktija, Prayer } from "./types";

const PRAYER_NAMES = [
  "Sabah",
  "Izlazak sunca",
  "Podne",
  "Ikindija",
  "Akšam",
  "Jacija",
];

type ApiDay = {
  vakat?: unknown;
};

type ApiMonth = {
  dan?: ApiDay[];
};

type ApiVaktija = {
  id?: number;
  lokacija?: string;
  godina?: number;
  mjesec?: ApiMonth[];
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isApiVaktija(value: unknown): value is ApiVaktija {
  return isObject(value) && Array.isArray(value.mjesec);
}

function normalizeTime(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  return null;
}

export function normalizeVaktija(
  raw: unknown,
  year: number
): NormalizedVaktija {
  if (!isApiVaktija(raw)) {
    return {
      year,
      days: [],
      raw,
    };
  }

  const days: DayVaktija[] = [];

  let dayOfYear = 0;

  for (const month of raw.mjesec ?? []) {
    for (const apiDay of month.dan ?? []) {
      const date = new Date(year, 0, dayOfYear + 1);

      const prayers: Prayer[] = [];

      if (Array.isArray(apiDay.vakat)) {
        for (
          let i = 0;
          i < Math.min(apiDay.vakat.length, PRAYER_NAMES.length);
          i++
        ) {
          const time = normalizeTime(apiDay.vakat[i]);

          if (time) {
            const prayerName =
              i === 2 && date.getDay() === 5
                ? "Džuma"
                : PRAYER_NAMES[i];

            prayers.push({
              name: prayerName,
              time,
            });
          }
        }
      }

      days.push({
        date,
        prayers,
        raw: apiDay,
      });

      dayOfYear++;
    }
  }

  return {
    year,
    days,
    raw,
  };
}

