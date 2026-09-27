/*
 * MENU KEBAB NASZ — tutaj edytujesz pozycje i ceny.
 * prices: { s: mały, m: średni, l: duży } — pomiń rozmiar, którego nie ma.
 * Pozycja z jedną ceną: prices: { one: 30 }
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

const MENU = [
  {
    id: "pita",
    name: "Pita Kebab",
    icon: "🥙",
    items: [
      { name: "Rollo kurczak / wołowina", desc: "mięso, surówka, sos", prices: { s: 15, m: 20, l: 25 } },
      { name: "Rollo z serem", desc: "mięso, ser, surówka, sos", prices: { s: 17, m: 22, l: 27 } },
      { name: "Rollo samo mięso", desc: "mięso, sos", prices: { m: 23, l: 30 } },
      { name: "Rollo z frytkami", desc: "mięso, surówka, sos, frytki", prices: { m: 23, l: 30 } },
      { name: "Gigantic Mega", desc: "podwójne mięso, ser, surówka, sos", prices: { one: 30 }, tag: "Hit" },
      { name: "Dürüm XXL (50 cm)", desc: "mięso, sos, ser, frytki", prices: { one: 39 }, tag: "XXL" },
      { name: "Rollo Strips", desc: "strips, surówka, sos", prices: { m: 20, l: 28 } },
      { name: "Rollo Nuggets", desc: "nuggets, surówka, sos", prices: { m: 20, l: 28 } },
      { name: "Rollo Halloumi z mięsem", desc: "ser halloumi, mięso, surówka, sos", prices: { one: 25 } },
    ],
  },
  {
    id: "tortilla",
    name: "Rollo Tortilla",
    icon: "🌯",
    items: [
      { name: "Tortilla", desc: "mięso, surówka, sos", prices: { s: 15, m: 20, l: 23 } },
      { name: "Tortilla z serem", desc: "mięso, ser, surówka, sos", prices: { s: 17, m: 22, l: 25 } },
    ],
  },
  {
    id: "bulka",
    name: "Kebab Bułka",
    icon: "🍔",
    items: [
      { name: "Kebab bułka", desc: "mięso, surówka, sos", prices: { l: 25 } },
      { name: "Bułka z frytkami", desc: "mięso, surówka, sos, frytki", prices: { l: 27 } },
      { name: "Bułka samo mięso", desc: "mięso, sos", prices: { l: 32 } },
    ],
  },
  {
    id: "box",
    name: "Kebab Box",
    icon: "🍟",
    items: [
      { name: "Kebab Box", desc: "mięso, surówka, sos, frytki", prices: { m: 20, l: 27 } },
      { name: "Kebab Box z serem", desc: "mięso, surówka, sos, frytki, ser", prices: { m: 22, l: 29 } },
      { name: "Box samo mięso", desc: "mięso, sos, frytki", prices: { m: 25, l: 29 } },
    ],
  },
  {
    id: "kapsalon",
    name: "Kapsalon",
    icon: "🧀",
    items: [
      { name: "Kapsalon", desc: "mięso, surówka, sos, frytki, ser", prices: { s: 23, l: 30 } },
    ],
  },
  {
    id: "talerz",
    name: "Talerz Kebab",
    icon: "🍽️",
    items: [
      { name: "Talerz kurczak / wołowina", desc: "mięso, surówka, sos, frytki", prices: { s: 28, m: 33, l: 38 } },
      { name: "Talerz samo mięso", desc: "mięso, sos", prices: { m: 36, l: 45 } },
    ],
  },
];
