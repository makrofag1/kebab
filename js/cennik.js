/*
 * Wczytywanie cennika z plików CSV w folderze dane/ (wysyłanych razem ze stroną).
 *   dane/rozmiary.csv — kod;nazwa                    (kolejność = kolejność cen przy pozycji)
 *   dane/sekcje.csv   — kod;nazwa;ikona              (kolejność = kolejność kategorii)
 *   dane/cennik.csv   — sekcja;nazwa;sklad;<kod rozmiaru>...;cena;oznaczenie
 * Obsługuje pliki z Excela: separator ; lub , ceny „17,00”, kodowanie UTF-8 lub Windows-1250.
 */
const Cennik = (function () {
  "use strict";

  const FILES = { rozmiary: "dane/rozmiary.csv", sekcje: "dane/sekcje.csv", cennik: "dane/cennik.csv" };

  // Nagłówki i kody bez polskich znaków i wielkości liter: „Skład” → „sklad”, „Średni” → „sredni”
  const norm = (s) => String(s || "").trim().toLowerCase().replace(/ł/g, "l").normalize("NFD").replace(/[̀-ͯ]/g, "");

  function decode(buffer) {
    try {
      return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
    } catch (e) {
      return new TextDecoder("windows-1250").decode(buffer); // „CSV (rozdzielany przecinkami)” z polskiego Excela
    }
  }

  function parseCSV(text) {
    text = text.replace(/^﻿/, "");
    const firstLine = text.split(/\r?\n/, 1)[0];
    const sep = (firstLine.match(/;/g) || []).length >= (firstLine.match(/,/g) || []).length ? ";" : ",";

    const rows = [];
    let row = [], field = "", quoted = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (quoted) {
        if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
        else if (ch === '"') quoted = false;
        else field += ch;
      } else if (ch === '"') quoted = true;
      else if (ch === sep) { row.push(field); field = ""; }
      else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(field); rows.push(row); row = []; field = "";
      } else field += ch;
    }
    if (field || row.length) { row.push(field); rows.push(row); }

    const nonEmpty = rows.filter((r) => r.some((v) => v.trim() !== ""));
    if (!nonEmpty.length) return [];
    const header = nonEmpty[0].map(norm);
    return nonEmpty.slice(1).map((r, idx) => {
      const obj = { _line: idx + 2 };
      header.forEach((h, i) => { obj[h] = (r[i] || "").trim(); });
      return obj;
    });
  }

  // „17,00” / „17.00” / „17 zł” → 17; puste → null; błędne → NaN
  function parsePrice(value) {
    const v = value.replace(/\s|zł|zl/gi, "").replace(",", ".");
    if (!v) return null;
    return /^\d+(\.\d+)?$/.test(v) ? Number(v) : NaN;
  }

  async function fetchCSV(file) {
    const res = await fetch(file, { cache: "no-cache" }); // zawsze sprawdź, czy plik się zmienił
    if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
    return parseCSV(decode(await res.arrayBuffer()));
  }

  async function load() {
    const [rozmiary, sekcje, cennik] = await Promise.all([
      fetchCSV(FILES.rozmiary), fetchCSV(FILES.sekcje), fetchCSV(FILES.cennik),
    ]);
    const warn = (file, row, msg) => console.warn(`[cennik] ${file}, wiersz ${row._line}: ${msg}`);

    const sizes = rozmiary
      .filter((r) => r.kod && r.nazwa || (warn(FILES.rozmiary, r, "brak kodu lub nazwy"), false))
      .map((r) => ({ code: norm(r.kod), label: r.nazwa }));

    const sections = new Map();
    sekcje.forEach((r) => {
      if (!r.kod || !r.nazwa) return warn(FILES.sekcje, r, "brak kodu lub nazwy");
      sections.set(norm(r.kod), { id: norm(r.kod).replace(/[^a-z0-9-]/g, "-"), name: r.nazwa, icon: r.ikona || "", items: [] });
    });

    cennik.forEach((r) => {
      const section = sections.get(norm(r.sekcja));
      if (!section) return warn(FILES.cennik, r, `nieznana sekcja „${r.sekcja}”`);
      if (!r.nazwa) return warn(FILES.cennik, r, "brak nazwy pozycji");

      const prices = [];
      const single = parsePrice(r.cena || "");
      if (single != null) prices.push({ size: null, value: single });
      else sizes.forEach((s) => {
        const v = parsePrice(r[s.code] || "");
        if (v != null) prices.push({ size: s.label, value: v });
      });

      if (prices.some((p) => Number.isNaN(p.value))) return warn(FILES.cennik, r, "niepoprawna cena");
      if (!prices.length) return warn(FILES.cennik, r, "pozycja bez ceny");
      section.items.push({ name: r.nazwa, desc: r.sklad || "", tag: r.oznaczenie || "", prices });
    });

    return [...sections.values()].filter((s) => s.items.length);
  }

  return { load, parseCSV, parsePrice };
})();
