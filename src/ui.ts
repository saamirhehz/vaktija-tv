import type { DayVaktija, Prayer } from "./types";
import { HADITHS, type Hadith } from "./types";

function getRandomHadith(): Hadith {
  return HADITHS[Math.floor(Math.random() * HADITHS.length)];
}
const app = document.querySelector<HTMLDivElement>("#app")!;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(date: Date): string {
  const months = [
    "januar",
    "februar",
    "mart",
    "april",
    "maj",
    "juni",
    "juli",
    "avgust",
    "septembar",
    "oktobar",
    "novembar",
    "decembar"
  ];

  return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}.`;
}

function normalizeTime(time: string): string {
  const match = time.match(/(\d{1,2})[:.](\d{2})/);

  if (!match) return time;

  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

function minutesFromTime(time: string): number | null {
  const match = normalizeTime(time).match(/^(\d{2}):(\d{2})$/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) return null;

  return hours * 60 + minutes;
}

function findNextPrayer(prayers: Prayer[], now: Date): Prayer | null {
  const currentMinutes =
    now.getHours() * 60 + now.getMinutes();

  for (const prayer of prayers) {
    const normalizedName = prayer.name.trim().toLowerCase();

    // Izlazak sunca nije namaz
    if (
      normalizedName === "izlazak sunca" ||
      normalizedName === "izlazak" ||
      normalizedName === "sunrise"
    ) {
      continue;
    }

    const minutes = minutesFromTime(prayer.time);

    if (minutes !== null && minutes > currentMinutes) {
      return prayer;
    }
  }

  return null;
}

export function renderLoading(message = "Učitavanje..."): void {
  app.innerHTML = `
    <main class="screen centered">
      <div class="loader"></div>
      <div class="loading-text">${escapeHtml(message)}</div>
    </main>
  `;
}

export function renderError(message: string): void {
  app.innerHTML = `
    <main class="screen centered">
      <div class="error-icon">!</div>
      <h1>Vaktija</h1>
      <p>${escapeHtml(message)}</p>
      <p class="muted">Pokušavam koristiti lokalno spremljene podatke.</p>
    </main>
  `;
}

export function renderApp(
  day: DayVaktija,
  locationName: string,
  source: "online" | "offline",
  lastUpdated: number | null
): void {

  const nextPrayer = findNextPrayer(day.prayers, new Date());
  const hadith = getRandomHadith();
  const backgroundImage = getCurrentBackgroundImage(
    day.prayers,
    new Date()
  );

  app.innerHTML = `
    <main class="screen">

      <section class="content">

        <header class="topbar">
  <div class="brand-area">
    <img
      src="/images/islamska-zajednica-logo.png"
      alt="Islamska zajednica"
      class="iz-logo"
    />

    <div>
      <div class="brand">Džemat Međaš</div>
      <div class="location">${escapeHtml(locationName)}</div>
    </div>
  </div>
</header>

        <section class="date-section">
        <div class="date">
          ${escapeHtml(formatDate(day.date))}
        </div>

        <div class="hijri-date">
          ${escapeHtml(formatHijriDate(day.date))}
        </div>

        <div id="clock" class="clock"></div>
      </section>

        <section class="prayers">
          ${
            day.prayers.length
              ? day.prayers.map((prayer) => `
                <div class="prayer ${
                  nextPrayer?.name === prayer.name ? "next" : ""
                }">
                  <div class="prayer-name">
                    ${escapeHtml(prayer.name)}
                  </div>

                  <div class="prayer-time">
                    ${escapeHtml(normalizeTime(prayer.time))}
                  </div>
                </div>
              `).join("")
              : `<div class="empty">
                  Nema prepoznatih vremena za ovaj dan.
                </div>`
          }
        </section>

        <section class="next-section">
          <div class="next-label">SLJEDEĆI NAMAZ</div>

          <div id="nextPrayer" class="next-prayer">
            ${
              nextPrayer
                ? `${escapeHtml(nextPrayer.name)}
                   <span>${escapeHtml(normalizeTime(nextPrayer.time))}</span>`
                : "Nema više namaza danas."
            }
          </div>

          <div id="countdown" class="countdown"></div>

         
        </section>



      </section>

      <aside
  id="vaktija-image"
  class="vaktija-image"
  style="background-image: url('${backgroundImage}')"
>
  <div class="hadith">
    <div class="hadith-title">HADIS</div>

    <div class="hadith-text">
      ${escapeHtml(hadith.text)}
    </div>

    <div class="hadith-source">
      — ${escapeHtml(hadith.source)}
    </div>
  </div>
</aside>

    </main>
  `;

  startClock(day);
}

function startClock(day: DayVaktija): void {
  const clock = document.querySelector<HTMLDivElement>("#clock");
  const countdown = document.querySelector<HTMLDivElement>("#countdown");
  const nextPrayerElement =
    document.querySelector<HTMLDivElement>("#nextPrayer");
  const prayersElement =
    document.querySelector<HTMLElement>(".prayers");
  const image =
    document.querySelector<HTMLElement>("#vaktija-image");

  if (!clock || !countdown || !nextPrayerElement || !prayersElement) {
    return;
  }

  const update = () => {
    const now = new Date();

    // CLOCK
    clock.textContent = new Intl.DateTimeFormat("bs-BA", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(now);

    // BACKGROUND
    const newBackgroundImage =
      getCurrentBackgroundImage(day.prayers, now);

    if (image) {
      const currentImage = image.dataset.image;

      if (currentImage !== newBackgroundImage) {
        image.dataset.image = newBackgroundImage;
        image.style.backgroundImage =
          `url("${newBackgroundImage}")`;
      }
    }

    // NEXT PRAYER
    const nextPrayer = findNextPrayer(day.prayers, now);

    // UPDATE HIGHLIGHT
    const prayerElements =
      prayersElement.querySelectorAll<HTMLElement>(".prayer");

    prayerElements.forEach((element, index) => {
      const prayer = day.prayers[index];

      element.classList.toggle(
        "next",
        nextPrayer?.name === prayer.name
      );
    });

    // NO MORE PRAYERS
    if (!nextPrayer) {
      nextPrayerElement.textContent = "Nema više namaza danas";
      countdown.textContent = "";
      return;
    }

    // NEXT PRAYER NAME + TIME
    nextPrayerElement.innerHTML = `
      ${escapeHtml(nextPrayer.name)}
      <span>${escapeHtml(normalizeTime(nextPrayer.time))}</span>
    `;

    // COUNTDOWN
    const minutes = minutesFromTime(nextPrayer.time);

    if (minutes === null) {
      countdown.textContent = "";
      return;
    }

    const target = new Date(now);

    target.setHours(
      Math.floor(minutes / 60),
      minutes % 60,
      0,
      0
    );

    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      countdown.textContent = "Preostalo 00:00:00";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    countdown.textContent =
      `Preostalo ${String(hours).padStart(2, "0")}:` +
      `${String(mins).padStart(2, "0")}:` +
      `${String(secs).padStart(2, "0")}`;
  };

  update();

  window.setInterval(update, 1000);
}

function getPrayerTime(
  prayers: Prayer[],
  names: string[]
): number | null {
  for (const prayer of prayers) {
    const normalizedName = prayer.name.trim().toLowerCase();

    if (names.some(name => normalizedName === name)) {
      return minutesFromTime(prayer.time);
    }
  }

  return null;
}

function getCurrentBackgroundImage(
  prayers: Prayer[],
  now: Date
): string {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const sunrise = getPrayerTime(prayers, [
    "izlazak sunca",
    "izlazak",
    "sunrise"
  ]);

  const aksham = getPrayerTime(prayers, [
    "akšam",
    "aksam",
    "maghrib"
  ]);

  const jacija = getPrayerTime(prayers, [
    "jacija",
    "isha"
  ]);

  // Izlazak sunca -> Akšam
  if (
    sunrise !== null &&
    aksham !== null &&
    currentMinutes >= sunrise &&
    currentMinutes < aksham
  ) {
    return "/images/day.jpg";
  }

  // Akšam -> Jacija
  if (
    aksham !== null &&
    jacija !== null &&
    currentMinutes >= aksham &&
    currentMinutes < jacija
  ) {
    return "/images/evening.png";
  }

  // Jacija -> Izlazak sunca
  return "/images/night.png";
}

function formatHijriDate(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "numeric",
    year: "numeric"
  }).formatToParts(date);

  const day = parts.find(p => p.type === "day")?.value;
  const month = Number(parts.find(p => p.type === "month")?.value);
  const year = parts.find(p => p.type === "year")?.value;

  const months = [
    "muharrem",
    "safer",
    "rebiul-evvel",
    "rebiul-ahir",
    "džumadel-ula",
    "džumadel-uhra",
    "redžeb",
    "šaban",
    "ramazan",
    "ševval",
    "zul-ka'de",
    "zul-hidždže"
  ];

  return `${day}. ${months[month - 1]} ${year}.`;
}
