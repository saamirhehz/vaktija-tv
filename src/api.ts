import { APP_CONFIG } from "./config";

export async function fetchVaktija(
  year: number,
  signal?: AbortSignal
): Promise<unknown> {
  const url =
    `${APP_CONFIG.apiBaseUrl}/` +
    `${APP_CONFIG.locationId}/` +
    `${year}`;

  const response = await fetch(url, {
    method: "GET",
    signal,
    cache: "no-store",
    headers: {
      "Accept": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error(`Vaktija API returned HTTP ${response.status}`);
  }

  return response.json();
}
