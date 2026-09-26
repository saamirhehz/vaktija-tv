import type { StoredVaktija } from "./types";

const DB_NAME = "VaktijaDB";
const DB_VERSION = 1;
const STORE_NAME = "years";

function key(locationId: number, year: number): string {
  return `${locationId}_${year}`;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveVaktija(
  locationId: number,
  year: number,
  data: unknown
): Promise<void> {
  const db = await openDb();

  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const item: StoredVaktija = {
      key: key(locationId, year),
      locationId,
      year,
      fetchedAt: Date.now(),
      data
    };

    store.put(item);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });

  db.close();
}

export async function loadVaktija(
  locationId: number,
  year: number
): Promise<StoredVaktija | null> {
  const db = await openDb();

  return new Promise<StoredVaktija | null>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(key(locationId, year));

    request.onsuccess = () => {
      resolve((request.result as StoredVaktija | undefined) ?? null);
      db.close();
    };

    request.onerror = () => {
      reject(request.error);
      db.close();
    };
  });
}

export async function clearVaktija(
  locationId: number,
  year: number
): Promise<void> {
  const db = await openDb();

  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(key(locationId, year));

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });

  db.close();
}
