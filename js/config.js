/*
 * USTAWIENIA STRONY KEBAB NASZ.
 * Menu i ceny są w plikach CSV w folderze dane/ (sekcje.csv, rozmiary.csv, cennik.csv).
 */
const SITE_CONFIG = {
  phone: "+48739506184",
  phoneDisplay: "739 506 184",
  // Link do zamówień online (Pyszne.pl / Glovo / Wolt) — zostaw pusty, jeśli brak
  orderUrl: "",
  // Godziny otwarcia: 0 = niedziela ... 6 = sobota
  hours: {
    0: ["10:00", "23:30"],
    1: ["10:00", "23:30"],
    2: ["10:00", "23:30"],
    3: ["10:00", "23:30"],
    4: ["10:00", "23:30"],
    5: ["10:00", "23:30"],
    6: ["10:00", "23:30"],
  },
};
