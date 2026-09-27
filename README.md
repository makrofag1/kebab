# Kebab Nasz – strona internetowa

Statyczna strona (HTML/CSS/JS) bez backendu i bez instalowania czegokolwiek.

| Plik | Co zawiera |
|---|---|
| `js/menu.js` | **menu, ceny, godziny otwarcia, telefon**, opcjonalny link do zamówień online |
| `index.html` | treść strony (sekcje, teksty, mapa) |
| `css/style.css` | wygląd i kolory |
| `js/main.js` | menu z zakładkami, układ menu na dużych ekranach, status „Otwarte teraz”, godziny |
| `images/` | logo i zdjęcie ulotki |

## Publikacja
Strona jest w pełni statyczna, więc działa na każdym hostingu:
- **Netlify Drop:** przeciągnij cały folder na https://app.netlify.com/drop
- **GitHub Pages** albo dowolny serwer: wgraj pliki tak, jak są.

## Podgląd lokalny
Otwórz `index.html` w przeglądarce albo uruchom:

```bash
python -m http.server 5173
```
