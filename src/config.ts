export const APP_CONFIG = {
  locationId: 45,
  locationName: "Kalesija",
  countryName: "Bosna i Hercegovina",

  apiBaseUrl: "https://api.vaktija.ba/vaktija/v1",

  // Koliko često pokušavamo osvježiti podatke dok je aplikacija aktivna.
  refreshIntervalMs: 24 * 60 * 60 * 1000,

  // Ako su podaci stariji od ovoga, pokušavamo ih osvježiti čim imamo internet.
  staleAfterMs: 24 * 60 * 60 * 1000
} as const;
