
# 📱 Workout Helper

**Workout Helper** je moderna fitness aplikacija izrađena u React + Vite okruženju, sa podrškom za mobilne uređaje korišćenjem Capacitor-a. Aplikacija omogućava korisnicima da prate svoje vežbe, istoriju treninga i napredak kroz interaktivan UI i korisnički pristup.

## ✨ Karakteristike
- Prikaz i organizacija trening dana (Push, Pull, Legs, Cardio)
- Evidencija ponavljanja, težina i setova
- Podrška za vežbe sa i bez opterećenja
- Brzi pomoćnik (Workout Helper chatbot)
- Responsive dizajn za mobilne uređaje
- Mobilna verzija kreirana uz Capacitor (Android APK)

## 🧩 Tehnologije
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Capacitor](https://capacitorjs.com/)
- [TailwindCSS](https://tailwindcss.com/) *(ako koristiš za stilizaciju)*

## 📂 Struktura fajlova

```
root/
│
├── public/               # Staticki fajlovi (favicon, manifest, ikone itd.)
├── src/
│   ├── assets/           # Slike, ikone i ostali asseti
│   ├── components/       # UI komponente (Cardovi, Dugmad, Modal itd.)
│   ├── pages/            # Glavne stranice (PushDay, PullDay, History itd.)
│   ├── helpers/          # Utility funkcije (npr. za konverziju podataka)
│   ├── App.jsx
│   └── main.jsx
│
├── capacitor.config.ts   # Capacitor konfiguracija
├── android/              # Android build fajlovi generisani od strane Capacitor-a
├── package.json
├── vite.config.ts
└── README.md
```

## 📲 Instalacija i build

**Lokalno pokretanje:**
```bash
npm install
npm run dev
```

**Build za produkciju:**
```bash
npm run build
```

**Generisanje Android APK-a:**
```bash
npx cap add android
npx cap open android
```

Zatim builduj iz Android Studija.

## 🖼️ Screenshotovi
Dodaj screenshotove aplikacije u ovom README fajlu sa opisima ispod svakog.

## 📬 Kontakt
Za bilo kakva pitanja ili predloge, slobodno me kontaktiraj putem GitHub Issues.
