(function () {
  "use strict";

  const SIZE_LABELS = { s: "Mały", m: "Średni", l: "Duży" };
  const SIZE_ORDER = ["s", "m", "l"];
  const DAY_NAMES = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
  const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]; // od poniedziałku

  const $ = (sel) => document.querySelector(sel);
  const el = (tag, cls, html) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html != null) node.innerHTML = html;
    return node;
  };
  const fmt = (n) => n.toFixed(2).replace(".", ",");

  /* ---------- Menu ---------- */
  // Cena jako „pigułka” z podpisem rozmiaru nad kwotą (bez podpisu, gdy pozycja ma jedną cenę)
  function priceTag(value, size) {
    const tag = el("span", "price");
    if (size) tag.appendChild(el("small", "price__size", SIZE_LABELS[size]));
    tag.appendChild(el("b", "price__value", fmt(value)));
    tag.setAttribute("aria-label", `${size ? SIZE_LABELS[size] + ": " : ""}${fmt(value)} zł`);
    return tag;
  }

  function renderCategory(cat) {
    const card = el("article", "cat");
    card.id = "kat-" + cat.id;
    card.dataset.cat = cat.id;

    const head = el("div", "cat__head");
    head.appendChild(el("h3", "cat__title", `<span class="cat__icon" aria-hidden="true">${cat.icon}</span>${cat.name}`));
    card.appendChild(head);

    const body = el("div", "cat__body");
    card.appendChild(body);

    cat.items.forEach((item) => {
      const row = el("div", "item");
      const info = el("div", "item__info");
      const tag = item.tag ? ` <span class="item__tag">${item.tag}</span>` : "";
      info.appendChild(el("div", "item__name", item.name + tag));
      info.appendChild(el("p", "item__desc", item.desc));
      row.appendChild(info);

      const prices = el("div", "item__prices");
      if (item.prices.one != null) {
        prices.appendChild(priceTag(item.prices.one));
      } else {
        SIZE_ORDER.filter((s) => item.prices[s] != null).forEach((s) => prices.appendChild(priceTag(item.prices[s], s)));
      }
      row.appendChild(prices);
      body.appendChild(row);
    });
    return card;
  }

  /* ---------- Układ menu na większych ekranach ---------- */
  // Na 1 kolumnie (telefon) nic nie zmieniamy. Od 2 kolumn karty są rozmieszczane algorytmem
  // masonry (grid z wierszami po ROW_UNIT px, każda karta do najniższej kolumny), a od 3 kolumn
  // wyraźnie dłuższe kategorie zajmują 2 kolumny i układają swoje pozycje obok siebie.
  const ROW_UNIT = 4;         // px — musi zgadzać się z grid-auto-rows w .menu__grid.is-masonry
  const WIDE_MIN_ITEMS = 4;   // minimalna liczba pozycji, by rozkładać kartę na 2 kolumny
  const WIDE_RATIO = 1.6;     // karta musi być o tyle wyższa od średniej pozostałych

  function layoutMenu() {
    const grid = $("#menuGrid");
    if (!grid) return;
    const cards = [...grid.querySelectorAll(".cat")];

    // Powrót do układu bazowego, żeby mierzyć naturalne wysokości kart
    grid.classList.remove("is-masonry");
    cards.forEach((c) => { c.classList.remove("cat--wide"); c.style.gridColumn = ""; c.style.gridRow = ""; });

    const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length;
    if (cols < 2) return;

    const visible = cards.filter((c) => !c.hidden);
    if (cols >= 3) {
      const heights = new Map(visible.map((c) => [c, c.offsetHeight]));
      visible.forEach((c) => {
        const others = visible.filter((o) => o !== c);
        const avg = others.reduce((sum, o) => sum + heights.get(o), 0) / others.length;
        // Pojedyncza kategoria (wybrana zakładka) nie ma z czym się porównać — liczy się tylko liczba pozycji
        const tall = others.length === 0 || heights.get(c) > avg * WIDE_RATIO;
        if (c.querySelectorAll(".item").length < WIDE_MIN_ITEMS || !tall) return;
        c.classList.add("cat--wide");
      });
    }

    grid.classList.add("is-masonry");
    const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
    const rows = new Map(visible.map((c) => [c, Math.ceil((c.offsetHeight + gap) / ROW_UNIT)]));
    const colWidth = (c) => (c.classList.contains("cat--wide") ? 2 : 1);

    // Najpierw karty szerokie, potem od najwyższej (przy remisie zostaje kolejność z menu)
    const order = [...visible].sort((a, b) => colWidth(b) - colWidth(a) || rows.get(b) - rows.get(a));
    const colTop = new Array(cols).fill(0); // zajęta wysokość każdej kolumny (w wierszach)

    order.forEach((c) => {
      const w = colWidth(c);
      let bestCol = 0, bestTop = Infinity;
      for (let i = 0; i <= cols - w; i++) {
        const top = Math.max(...colTop.slice(i, i + w));
        if (top < bestTop) { bestTop = top; bestCol = i; }
      }
      c.style.gridColumn = `${bestCol + 1} / span ${w}`;
      c.style.gridRow = `${bestTop + 1} / span ${rows.get(c)}`;
      colTop.fill(bestTop + rows.get(c), bestCol, bestCol + w);
    });
  }

  function initMenuLayout() {
    const grid = $("#menuGrid");
    if (!grid) return;
    let timer = 0;
    const schedule = () => { clearTimeout(timer); timer = setTimeout(layoutMenu, 60); };

    if ("ResizeObserver" in window) {
      let lastWidth = -1;
      new ResizeObserver(([entry]) => {
        const w = Math.round(entry.contentRect.width);
        if (w !== lastWidth) { lastWidth = w; schedule(); } // reagujemy tylko na zmianę szerokości
      }).observe(grid);
    } else {
      window.addEventListener("resize", schedule);
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
    layoutMenu();
  }

  function renderMenu() {
    const grid = $("#menuGrid");
    const tabs = $("#menuTabs");
    if (!grid || typeof MENU === "undefined") return;

    MENU.forEach((cat) => grid.appendChild(renderCategory(cat)));

    const tabDefs = [{ id: "all", name: "Wszystko", icon: "⭐" }].concat(MENU);
    tabDefs.forEach((t, i) => {
      const btn = el("button", "tab", `${t.icon} ${t.name}`);
      btn.type = "button";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
      btn.setAttribute("aria-controls", "menuGrid");
      btn.dataset.filter = t.id;
      tabs.appendChild(btn);
    });

    tabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".tab");
      if (!btn) return;
      const f = btn.dataset.filter;
      tabs.querySelectorAll(".tab").forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
      grid.querySelectorAll(".cat").forEach((c) => {
        const show = f === "all" || c.dataset.cat === f;
        c.hidden = !show;
        if (show) { c.style.animation = "none"; void c.offsetWidth; c.style.animation = ""; }
      });
      layoutMenu();
    });
  }

  /* ---------- Godziny i status ---------- */
  function warsawNow() {
    // Czas w Polsce niezależnie od strefy czasowej odwiedzającego
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Warsaw", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false,
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const dayIdx = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { day: dayIdx, minutes: (parseInt(get("hour"), 10) % 24) * 60 + parseInt(get("minute"), 10) };
  }
  const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };

  function isOpenAt(day, minutes) {
    const hours = SITE_CONFIG.hours;
    const today = hours[day];
    if (today) {
      const o = toMin(today[0]), c = toMin(today[1]);
      if (c > o ? minutes >= o && minutes < c : minutes >= o) return { open: true, closes: today[1] };
    }
    // godziny przechodzące przez północ z poprzedniego dnia
    const prev = hours[(day + 6) % 7];
    if (prev) {
      const o = toMin(prev[0]), c = toMin(prev[1]);
      if (c <= o && minutes < c) return { open: true, closes: prev[1] };
    }
    return { open: false };
  }

  function nextOpening(day, minutes) {
    for (let i = 0; i < 7; i++) {
      const d = (day + i) % 7;
      const h = SITE_CONFIG.hours[d];
      if (!h) continue;
      if (i === 0 && toMin(h[0]) <= minutes) continue;
      return i === 0 ? `dziś od ${h[0]}` : i === 1 ? `jutro od ${h[0]}` : `${DAY_NAMES[d].toLowerCase()} od ${h[0]}`;
    }
    return "";
  }

  function renderStatus() {
    const box = $("#openStatus");
    if (!box || typeof SITE_CONFIG === "undefined") return;
    const { day, minutes } = warsawNow();
    const st = isOpenAt(day, minutes);
    box.classList.toggle("is-open", st.open);
    box.classList.toggle("is-closed", !st.open);
    box.querySelector(".status__label").textContent = st.open
      ? `Otwarte teraz · do ${st.closes}`
      : `Teraz zamknięte · otwieramy ${nextOpening(day, minutes)}`;
  }

  function renderHours() {
    const body = $("#hoursTable tbody");
    if (!body) return;
    const { day } = warsawNow();
    WEEK_ORDER.forEach((d) => {
      const h = SITE_CONFIG.hours[d];
      const tr = el("tr", d === day ? "is-today" : "");
      const badge = d === day ? '<span class="today-badge">dziś</span>' : "";
      tr.appendChild(el("td", null, DAY_NAMES[d] + badge));
      tr.appendChild(el("td", null, h ? `${h[0]} – ${h[1]}` : "nieczynne"));
      body.appendChild(tr);
    });
  }

  /* ---------- Nawigacja mobilna ---------- */
  function initNav() {
    const nav = $(".nav");
    const toggle = $("#navToggle");
    if (!nav || !toggle) return;
    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
    };
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    $("#navLinks").addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  }

  /* ---------- Stały przycisk „Zadzwoń” ---------- */
  function initFab() {
    const fab = $(".fab");
    const hero = $(".hero");
    if (!fab || !hero || !("IntersectionObserver" in window)) { fab && fab.classList.add("is-visible"); return; }
    new IntersectionObserver(([entry]) => fab.classList.toggle("is-visible", !entry.isIntersecting), {
      rootMargin: "-40% 0px 0px 0px",
    }).observe(hero);
  }

  /* ---------- Ulotka ---------- */
  function initFlyer() {
    const dlg = $("#flyerDialog");
    const btn = $("#flyerBtn");
    if (!dlg || !btn) return;
    if (typeof dlg.showModal !== "function") {
      btn.addEventListener("click", () => window.open("images/menu-ulotka.webp", "_blank"));
      return;
    }
    btn.addEventListener("click", () => dlg.showModal());
    $("#flyerClose").addEventListener("click", () => dlg.close());
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  }

  /* ---------- Zamówienia online (opcjonalnie) ---------- */
  function initOrderLink() {
    const a = $("#orderOnline");
    if (a && SITE_CONFIG.orderUrl) { a.href = SITE_CONFIG.orderUrl; a.hidden = false; }
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderMenu();
    initMenuLayout();
    renderStatus();
    renderHours();
    initNav();
    initFab();
    initFlyer();
    initOrderLink();
    $("#year").textContent = new Date().getFullYear();
    setInterval(renderStatus, 60 * 1000);
  });
})();
