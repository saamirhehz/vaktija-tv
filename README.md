# Vaktija

Offline-first Vaktija aplikacija za Android TV.

## Stack
- TypeScript
- Vite
- HTML/CSS
- IndexedDB
- Android WebView wrapper (Gradle/Kotlin)

## Pokretanje web aplikacije

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Produkcijski fajlovi su u `dist/`.

## Konfiguracija

U `src/config.ts` promijeni:
- `locationId` — ID lokacije iz API-ja
- `locationName`
- `countryName`

API format:

`https://api.vaktija.ba/vaktija/v1/{locationId}/{year}`

## Offline ponašanje

Aplikacija:
1. učita lokalno spremljenu godinu iz IndexedDB-a
2. odmah prikaže lokalne podatke ako postoje
3. ako postoji internet, pokuša preuzeti svježe podatke
4. ako API nije dostupan, nastavlja koristiti zadnje spremljene podatke

Podaci su spremljeni po kombinaciji `locationId + year`.

## Android TV

Android projekat je u `android/`.

Iz Android Studio-a otvori folder `android/`, zatim:

```bash
./gradlew assembleDebug
```

APK:

`android/app/build/outputs/apk/debug/app-debug.apk`

Web aplikacija se prije builda kopira u:

`android/app/src/main/assets/web/`

Za ručni update:

```bash
npm run build
npm run android:sync
```

Za Windows `gradlew.bat` možeš koristiti direktno iz `android/`.
