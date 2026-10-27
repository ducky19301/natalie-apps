(() => {
  const pageStack = document.getElementById("pageStack");
  const dotsEl = document.getElementById("dots");
  const dateList = document.getElementById("dateList");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const book = document.getElementById("book");
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");

  let pages = [];
  let index = 0;
  let flipping = false;

  function formatDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    return dt.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  }

  function formatDateShort(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    return dt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buildPages(entries) {
    const list = [];

    list.push({
      type: "cover",
      html: `
        <div class="cover-ornament">✦ · ✦ · ✦</div>
        <h2>Natalie’s<br/>Daily Deck</h2>
        <div class="rule"></div>
        <p class="subtitle">Card · Sit-with · Chart weave</p>
        <p class="cover-meta">A sacred notebook of draws</p>
        <div class="cover-ornament" style="margin-top:2rem">☽</div>
      `,
    });

    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

    for (const entry of sorted) {
      entry.cards.forEach((card, i) => {
        const isReversed = (card.orientation || "").toLowerCase() === "reversed";
        const isUnknown = (card.orientation || "").toLowerCase() === "unknown";
        const badgeClass = isReversed ? "badge reversed" : isUnknown ? "badge unknown" : "badge";
        const orientLabel = isReversed ? "Reversed" : isUnknown ? "Orientation not recorded" : "Upright";
        const showNotes = i === entry.cards.length - 1 && entry.notes && entry.cards.length < 2;

        list.push({
          type: "card",
          date: entry.date,
          cardName: card.name,
          html: `
            <div class="page-header">
              <span class="page-date">${escapeHtml(formatDate(entry.date))}</span>
              <span class="${badgeClass}">${orientLabel}</span>
            </div>
            <div class="card-visual">
              <div class="card-frame ${isReversed ? "reversed" : ""}">
                <img src="${escapeHtml(card.img)}" alt="${escapeHtml(card.name)}" loading="lazy" />
              </div>
            </div>
            <h3 class="card-name">${escapeHtml(card.name)}</h3>
            <p class="source-tag">${escapeHtml(card.source || "draw")}</p>
            <div class="section">
              <h4 class="section-label">Summary</h4>
              <p>${escapeHtml(card.summary || "")}</p>
            </div>
            <div class="section sit-with">
              <h4 class="section-label">Sit with</h4>
              <p>${escapeHtml(card.sitWith || "")}</p>
            </div>
            ${
              card.astro
                ? `<div class="section astro">
                    <h4 class="section-label">Astro · chart weave</h4>
                    <p>${escapeHtml(card.astro)}</p>
                  </div>`
                : ""
            }
            ${
              entry.myNotes && entry.cards.length < 2 && i === entry.cards.length - 1
                ? `<div class="section day-notes"><h4 class="section-label">My notes</h4><p style="white-space:pre-wrap">${escapeHtml(entry.myNotes)}</p></div>`
                : ""
            }
            ${
              showNotes
                ? `<div class="section day-notes">
                    <h4 class="section-label">Day notes</h4>
                    <p>${escapeHtml(entry.notes)}</p>
                  </div>`
                : ""
            }
          `,
        });
      });
      if (entry.cards.length > 1) {
        const tiles = entry.cards.map((card, i) => {
          const rev = (card.orientation || "").toLowerCase() === "reversed";
          return `<figure class="spread-card">
              <div class="card-frame ${rev ? "reversed" : ""}"><img src="${escapeHtml(card.img)}" alt="${escapeHtml(card.name)}" loading="lazy" /></div>
              <figcaption><span class="spread-pos">Card ${i + 1}</span>${escapeHtml(card.name)}<span class="spread-orient">${rev ? "Reversed" : "Upright"}</span></figcaption>
            </figure>`;
        }).join("");
        list.push({
          type: "spread",
          date: entry.date,
          cardName: "Full reading",
          html: `
            <div class="page-header">
              <span class="page-date">${escapeHtml(formatDate(entry.date))}</span>
              <span class="badge">${entry.cards.length}-card reading</span>
            </div>
            <h3 class="card-name">The Reading Together</h3>
            <div class="spread-row">${tiles}</div>
            <div class="section">
              <h4 class="section-label">Cards in this reading</h4>
              <p>${entry.cards.map((c) => escapeHtml(c.name) + ((c.orientation || "").toLowerCase() === "reversed" ? " (reversed)" : "")).join(" · ")}</p>
            </div>
            ${entry.notes ? `<div class="section day-notes"><h4 class="section-label">Reading notes · how they speak together</h4><p>${escapeHtml(entry.notes)}</p></div>` : ""}
            ${entry.myNotes ? `<div class="section day-notes"><h4 class="section-label">My notes</h4><p style="white-space:pre-wrap">${escapeHtml(entry.myNotes)}</p></div>` : ""}
          `,
        });
      }
    }

    return list;
  }

  function renderDOM(pageData) {
    pageStack.innerHTML = "";
    dotsEl.innerHTML = "";

    pageData.forEach((p, i) => {
      const el = document.createElement("article");
      el.className = "page" + (p.type === "cover" ? " cover" : "");
      el.dataset.index = String(i);
      el.innerHTML = p.html;
      if (i === 0) el.classList.add("active");
      pageStack.appendChild(el);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", p.type === "cover" ? "Cover" : `${p.cardName}, ${p.date}`);
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goTo(i));
      dotsEl.appendChild(dot);
    });

    // Sidebar date groups
    dateList.innerHTML = "";
    const coverBtn = document.createElement("button");
    coverBtn.type = "button";
    coverBtn.innerHTML = `Cover<span class="date-sub">Open the book</span>`;
    coverBtn.addEventListener("click", () => {
      goTo(0);
      sidebar.classList.remove("open");
    });
    dateList.appendChild(coverBtn);

    const byDate = new Map();
    pageData.forEach((p, i) => {
      if (!p.date) return;
      if (!byDate.has(p.date)) byDate.set(p.date, []);
      byDate.get(p.date).push({ i, name: p.cardName });
    });

    for (const [date, cards] of byDate) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.date = date;
      const names = cards.map((c) => c.name).join(" · ");
      btn.innerHTML = `${escapeHtml(formatDateShort(date))}<span class="date-sub">${escapeHtml(names)}</span>`;
      btn.addEventListener("click", () => {
        goTo(cards[0].i);
        sidebar.classList.remove("open");
      });
      dateList.appendChild(btn);
    }
  }

  function updateChrome() {
    prevBtn.disabled = index <= 0;
    nextBtn.disabled = index >= pages.length - 1;

    pageStack.querySelectorAll(".page").forEach((el, i) => {
      el.classList.toggle("active", i === index);
    });
    dotsEl.querySelectorAll("button").forEach((el, i) => {
      el.classList.toggle("active", i === index);
    });

    const current = pages[index];
    dateList.querySelectorAll("button").forEach((btn, i) => {
      if (i === 0) {
        btn.classList.toggle("active", index === 0);
      } else {
        btn.classList.toggle("active", current && btn.dataset.date === current.date);
      }
    });
  }

  function goTo(next, dir) {
    if (flipping || next === index || next < 0 || next >= pages.length) return;
    flipping = true;

    const from = pageStack.querySelector(`.page[data-index="${index}"]`);
    const to = pageStack.querySelector(`.page[data-index="${next}"]`);
    const direction = dir || (next > index ? 1 : -1);

    if (from) {
      from.classList.remove("active");
      from.classList.add(direction > 0 ? "exit-left" : "exit-right");
    }

    index = next;
    if (to) {
      to.classList.remove("exit-left", "exit-right");
      // Force reflow so enter animation plays
      void to.offsetWidth;
      to.classList.add("active");
    }

    updateChrome();

    setTimeout(() => {
      pageStack.querySelectorAll(".page").forEach((el) => {
        el.classList.remove("exit-left", "exit-right");
      });
      flipping = false;
    }, 520);
  }

  function next() {
    goTo(index + 1, 1);
  }
  function prev() {
    goTo(index - 1, -1);
  }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      prev();
    }
  });

  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  // Swipe
  let touchX = null;
  book.addEventListener(
    "touchstart",
    (e) => {
      touchX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );
  book.addEventListener(
    "touchend",
    (e) => {
      if (touchX == null) return;
      const dx = e.changedTouches[0].screenX - touchX;
      touchX = null;
      if (Math.abs(dx) < 50) return;
      if (dx < 0) next();
      else prev();
    },
    { passive: true }
  );

  // Click edges of book
  book.addEventListener("click", (e) => {
    if (e.target.closest("a, button")) return;
    const rect = book.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width * 0.28) prev();
    else if (x > rect.width * 0.72) next();
  });

  async function init() {
    try {
      const res = await fetch("entries.json", { cache: "no-store" });
      if (!res.ok) throw new Error("Could not load entries.json");
      const entries = await res.json();
      pages = buildPages(entries);
      renderDOM(pages);
      index = 0;
      updateChrome();
      book.focus();
    } catch (err) {
      pageStack.innerHTML = `<article class="page active cover"><h2>Couldn’t open the journal</h2><p class="subtitle">${escapeHtml(err.message)}. Serve this folder over HTTP (python -m http.server).</p></article>`;
    }
  }

  init();
})();
