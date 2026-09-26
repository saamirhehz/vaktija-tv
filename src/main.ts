import "./styles.css";

import * as config from "./config";
import { fetchVaktija } from "./api";
import { loadVaktija, saveVaktija } from "./storage";
import { normalizeVaktija } from "./normalize";
import { renderApp, renderError, renderLoading } from "./ui";

const year = new Date().getFullYear();

let currentRaw: unknown = null;
let refreshTimer: number | undefined;

async function getLocalData() {
  return loadVaktija(config.APP_CONFIG.locationId, year);
}

async function refreshFromApi(): Promise<void> {
  if (!navigator.onLine) {
    throw new Error("Offline");
  }

  const raw = await fetchVaktija(year);
  console.log("Fetched Vaktija data from API:", raw);
  await saveVaktija(config.APP_CONFIG.locationId, year, raw);

  currentRaw = raw;
}

async function renderFromStorageOrFail(): Promise<boolean> {
  const stored = await getLocalData();

  if (!stored) {
    return false;
  }

  currentRaw = stored.data;

  const normalized = normalizeVaktija(stored.data, year);
  const today = getToday(normalized.days);

  if (!today) {
    renderError("Za današnji datum nema podataka.");
    return true;
  }

  renderApp(
    today,
    config.APP_CONFIG.locationName,
    navigator.onLine ? "online" : "offline",
    stored.fetchedAt
  );

  return true;
}

function getToday(days: ReturnType<typeof normalizeVaktija>["days"]) {
  const now = new Date();

  return days.find((day) =>
    day.date.getFullYear() === now.getFullYear() &&
    day.date.getMonth() === now.getMonth() &&
    day.date.getDate() === now.getDate()
  ) ?? days[0] ?? null;
}

async function startup(): Promise<void> {
  renderLoading("Učitavanje vaktije...");

  const local = await getLocalData();

  if (local) {
    await renderFromStorageOrFail();
  }

  if (navigator.onLine) {
    try {
      await refreshFromApi();
      await renderFromStorageOrFail();
    } catch (error) {
      console.warn("Online refresh failed:", error);

      if (!local) {
        renderError(
          "Nema lokalnih podataka i Vaktija API trenutno nije dostupan."
        );
      }
    }
  } else if (!local) {
    renderError(
      "Aplikacija je offline i još nema spremljene podatke za ovu godinu."
    );
  }

  scheduleRefresh();
}

function scheduleRefresh(): void {
  if (refreshTimer !== undefined) {
    window.clearInterval(refreshTimer);
  }

  refreshTimer = window.setInterval(async () => {
    if (!navigator.onLine) return;

    try {
      await refreshFromApi();
      await renderFromStorageOrFail();
    } catch (error) {
      console.warn("Scheduled refresh failed:", error);
    }
  }, config.APP_CONFIG.refreshIntervalMs);
}

window.addEventListener("online", async () => {
  try {
    await refreshFromApi();
    await renderFromStorageOrFail();
  } catch (error) {
    console.warn("Online event refresh failed:", error);
  }
});

window.addEventListener("offline", async () => {
  await renderFromStorageOrFail();
});

void startup();
