# Kebab Nasz – strona internetowa

Statyczna strona (HTML/CSS/JS) bez backendu i bez instalowania czegokolwiek.

| Plik | Co zawiera |
|---|---|
| `dane/*.csv` | **menu i ceny** — patrz niżej |
| `js/config.js` | godziny otwarcia, telefon, opcjonalny link do zamówień online |
| `js/cennik.js` | wczytywanie cennika z plików CSV |
| `index.html` | treść strony (sekcje, teksty, mapa) |
| `css/style.css` | wygląd i kolory |
| `js/main.js` | menu z zakładkami, układ menu na dużych ekranach, status „Otwarte teraz”, godziny |
| `images/` | logo (`logo.svg`) |

## Cennik (pliki CSV)
Pliki w folderze `dane/` są wysyłane razem ze stroną, a przeglądarka sama buduje z nich menu.
Można je edytować w Excelu (zapis jako „CSV UTF-8” albo zwykły „CSV” — oba działają).

- `rozmiary.csv` — `kod;nazwa`, np. `maly;Mały`. Kolejność wierszy = kolejność cen przy pozycji.
- `sekcje.csv` — `kod;nazwa;ikona`, np. `pita;Pita Kebab;🥙`. Kolejność wierszy = kolejność kategorii.
- `cennik.csv` — `sekcja;nazwa;sklad;<kolumna dla każdego kodu rozmiaru>;cena;oznaczenie`
  - `sekcja` = kod z `sekcje.csv`,
  - ceny wpisuj w kolumnach rozmiarów (np. `17,00`); puste pole = brak tego rozmiaru,
  - `cena` — tylko dla pozycji z jedną ceną (wtedy kolumny rozmiarów zostaw puste),
  - `oznaczenie` — opcjonalna plakietka, np. `Hit`, `XXL`.

Nowy rozmiar: dopisz wiersz w `rozmiary.csv` i kolumnę o tym samym kodzie w `cennik.csv`.
Błędne wiersze są pomijane (szczegóły w konsoli przeglądarki, F12).

## Publikacja
Strona jest w pełni statyczna, więc działa na każdym hostingu:
- **Netlify Drop:** przeciągnij cały folder na https://app.netlify.com/drop
- **GitHub Pages** albo dowolny serwer: wgraj pliki tak, jak są.

## Podgląd lokalny
Cennik wczytuje się tylko przez serwer (tak jak na hostingu) — samo kliknięcie w `index.html` pokaże komunikat zamiast menu. Uruchom:

```bash
python -m http.server 5173
```
