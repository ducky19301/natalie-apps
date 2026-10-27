/**
 * Historic monetization — free tier ads + Historic+ mock subscription.
 * Persist: localStorage key historic.entitlement
 * Config: set ADS_CLIENT_ID / real AdMob / Stripe IDs when ready (see docs/monetization.md).
 * Never loads third-party ad networks while IDs are empty.
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'historic.entitlement';
  var PREFS_KEY = 'historic.monetization.prefs';
  var PRICE_LABEL = '$4.99/mo';
  var PRODUCT_ID = 'historic_plus_monthly';

  /** Paste real IDs later — empty = house test placeholders only. */
  var CONFIG = {
    ADS_CLIENT_ID: '', // AdSense client e.g. ca-pub-xxxxxxxx
    ADS_SLOT_BANNER: '',
    STRIPE_PRICE_ID: '', // optional web Checkout later
    PRODUCT_ID: PRODUCT_ID,
    PRICE_LABEL: PRICE_LABEL,
    // Google sample / test unit IDs (mobile docs); web uses house blocks
    ADMOB_BANNER_TEST: 'ca-app-pub-3940256099942544/6300978111',
    ADMOB_APP_ANDROID: 'ca-app-pub-3940256099942544~3347511713',
    ADMOB_APP_IOS: 'ca-app-pub-3940256099942544~1458002511'
  };

  function prefersReducedMotion() {
    try {
      return !!(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (e) {
      return false;
    }
  }

  function readEntitlement() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { subscribed: false, source: null, updatedAt: null };
      var data = JSON.parse(raw);
      return {
        subscribed: !!data.subscribed,
        source: data.source || null,
        updatedAt: data.updatedAt || null,
        productId: data.productId || PRODUCT_ID
      };
    } catch (e) {
      return { subscribed: false, source: null, updatedAt: null };
    }
  }

  function writeEntitlement(ent) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ent));
    try {
      global.dispatchEvent(new CustomEvent('historic:entitlement', { detail: ent }));
    } catch (e) {}
    postToNative({ type: 'historic.entitlement', entitlement: ent });
  }

  function postToNative(payload) {
    try {
      if (global.ReactNativeWebView && typeof global.ReactNativeWebView.postMessage === 'function') {
        global.ReactNativeWebView.postMessage(JSON.stringify(payload));
      }
    } catch (e) {}
  }

  function isSubscribed() {
    return !!readEntitlement().subscribed;
  }

  function subscribeMock(source) {
    var ent = {
      subscribed: true,
      source: source || 'mock',
      productId: PRODUCT_ID,
      updatedAt: new Date().toISOString()
    };
    writeEntitlement(ent);
    refreshUI();
    return ent;
  }

  function unsubscribeMock() {
    var ent = {
      subscribed: false,
      source: 'mock-cancel',
      productId: PRODUCT_ID,
      updatedAt: new Date().toISOString()
    };
    writeEntitlement(ent);
    refreshUI();
    return ent;
  }

  function restore() {
    var ent = readEntitlement();
    refreshUI();
    return ent;
  }

  function applyNativeEntitlement(ent) {
    if (!ent || typeof ent !== 'object') return;
    writeEntitlement({
      subscribed: !!ent.subscribed,
      source: ent.source || 'native',
      productId: ent.productId || PRODUCT_ID,
      updatedAt: ent.updatedAt || new Date().toISOString()
    });
    refreshUI();
  }

  function resolveScriptBase() {
    var el = document.currentScript;
    if (el && el.src) {
      return el.src.replace(/[^/]+$/, '');
    }
    var path = (location.pathname || '').replace(/\\/g, '/');
    if (/\/(stories|categories|ages)\//.test(path)) return '../js/';
    return 'js/';
  }

  function injectStyles() {
    if (document.getElementById('historic-monetization-css')) return;
    var css = document.createElement('style');
    css.id = 'historic-monetization-css';
    css.textContent = [
      '.hx-account-chip{display:inline-flex;align-items:center;gap:.45rem;flex-wrap:wrap}',
      '.hx-badge{font-size:.65rem;letter-spacing:.14em;text-transform:uppercase;color:#100e0c;background:linear-gradient(135deg,#c9a06a,#e8c547);padding:.28rem .55rem;border-radius:999px;font-weight:600}',
      '.hx-gear,.hx-chip-btn{font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(240,230,212,.75);border:1px solid rgba(166,124,74,.4);background:transparent;padding:.4rem .7rem;border-radius:999px;cursor:pointer;font-family:inherit;min-height:40px}',
      '.hx-gear:hover,.hx-chip-btn:hover{border-color:#c9a06a;color:#f0e6d4}',
      '.hx-ad-banner{position:fixed;left:0;right:0;bottom:0;z-index:60;display:flex;justify-content:center;padding:.45rem .75rem calc(.45rem + env(safe-area-inset-bottom,0));background:rgba(16,14,12,.94);border-top:1px solid rgba(166,124,74,.28);backdrop-filter:blur(8px)}',
      'body.hx-has-ads{padding-bottom:4.5rem}',
      '.hx-ad-slot{width:min(728px,100%);min-height:56px;border:1px dashed rgba(166,124,74,.35);border-radius:10px;background:rgba(26,22,18,.9);display:flex;align-items:center;justify-content:center;gap:.75rem;padding:.55rem .85rem;color:rgba(240,230,212,.55);font-size:.78rem;text-align:center}',
      '.hx-ad-slot .hx-ad-label{font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:#a67c4a}',
      '.hx-ad-slot .hx-ad-cta{font-size:.72rem;color:#c9a06a;background:none;border:none;cursor:pointer;text-decoration:underline;font-family:inherit}',
      '.hx-ad-inline{margin:1.25rem auto;width:min(720px,92%);}',
      '.hx-ad-inline .hx-ad-slot{min-height:72px}',
      'body.hx-subscribed .hx-ad-banner,body.hx-subscribed .hx-ad-inline{display:none!important}',
      '.hx-modal-backdrop{position:fixed;inset:0;z-index:80;background:rgba(8,6,4,.72);display:flex;align-items:center;justify-content:center;padding:1.25rem}',
      '.hx-modal{width:min(420px,100%);background:#1a1612;border:1px solid rgba(166,124,74,.4);border-radius:16px;padding:1.5rem 1.35rem 1.25rem;box-shadow:0 24px 60px rgba(0,0,0,.55);color:#f0e6d4}',
      '.hx-modal h2{font-family:"IM Fell English",Georgia,serif;font-size:1.55rem;font-weight:400;margin-bottom:.5rem}',
      '.hx-modal p{font-size:.95rem;line-height:1.5;color:rgba(240,230,212,.7);margin-bottom:1rem}',
      '.hx-modal .hx-price{font-family:"Cormorant Garamond",Georgia,serif;font-size:1.35rem;color:#c9a06a;margin-bottom:1rem}',
      '.hx-modal-actions{display:flex;flex-direction:column;gap:.55rem}',
      '.hx-btn-primary{background:linear-gradient(135deg,#a67c4a,#c9a06a);color:#100e0c;border:none;border-radius:999px;padding:.75rem 1rem;font-weight:600;font-size:.9rem;cursor:pointer;font-family:inherit}',
      '.hx-btn-secondary{background:transparent;color:rgba(240,230,212,.75);border:1px solid rgba(166,124,74,.35);border-radius:999px;padding:.65rem 1rem;font-size:.82rem;cursor:pointer;font-family:inherit}',
      '.hx-btn-ghost{background:none;border:none;color:rgba(240,230,212,.45);font-size:.78rem;cursor:pointer;margin-top:.35rem;font-family:inherit}',
      '.hx-settings{position:fixed;inset:0;z-index:85;background:rgba(8,6,4,.78);display:flex;align-items:flex-end;justify-content:center;padding:1rem}',
      '.hx-settings-panel{width:min(440px,100%);background:#1a1612;border:1px solid rgba(166,124,74,.35);border-radius:16px 16px 12px 12px;padding:1.25rem;color:#f0e6d4;max-height:85vh;overflow:auto}',
      '.hx-settings-panel h2{font-family:"IM Fell English",Georgia,serif;font-size:1.35rem;margin-bottom:.75rem}',
      '.hx-status-row{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.75rem 0;border-bottom:1px solid rgba(166,124,74,.15);margin-bottom:.75rem}',
      '.hx-hint{font-size:.78rem;color:rgba(240,230,212,.45);line-height:1.4;margin:.5rem 0 1rem}',
      '@media (prefers-reduced-motion:reduce){.hx-ad-slot,.hx-modal,.hx-settings-panel{transition:none!important}}',
      '.topbar .hx-account-chip{margin-left:auto}'
    ].join('');
    document.head.appendChild(css);
  }

  function makeAdSlot(kind) {
    var wrap = document.createElement('div');
    wrap.className = kind === 'banner' ? 'hx-ad-banner' : 'hx-ad-inline';
    wrap.setAttribute('data-hx-ad', kind);
    wrap.setAttribute('aria-label', 'Sponsored placeholder');
    var slot = document.createElement('div');
    slot.className = 'hx-ad-slot';
    var label = document.createElement('div');
    label.innerHTML = '<div class="hx-ad-label">Sponsored · test ad</div><div>Historic keeps stories free with gentle ads.</div>';
    var cta = document.createElement('button');
    cta.type = 'button';
    cta.className = 'hx-ad-cta';
    cta.textContent = 'Go ad-free';
    cta.addEventListener('click', function () { openPaywall(); });
    slot.appendChild(label);
    slot.appendChild(cta);
    wrap.appendChild(slot);
    return wrap;
  }

  function renderAds() {
    document.querySelectorAll('[data-hx-ad]').forEach(function (n) { n.remove(); });
    document.body.classList.remove('hx-has-ads');
    if (isSubscribed()) return;
    if (CONFIG.ADS_CLIENT_ID) {
      // Future: load AdSense only when client id is set. Stub keeps policy-safe.
      // Intentionally not injecting external scripts.
    }
    document.body.classList.add('hx-has-ads');
    var banner = makeAdSlot('banner');
    document.body.appendChild(banner);

    // Between/after chapter sections (scroll stories) — never mid-sentence
    var chapters = document.querySelectorAll('main.chapters > section.chapter, .chapters > .chapter, section.chapter');
    if (chapters.length) {
      chapters.forEach(function (ch, i) {
        if (i === 0) return; // after chapter 1 boundary = before ch2, etc.
        if ((i % 2) !== 0) return; // every other section boundary
        var inline = makeAdSlot('inline');
        ch.parentNode.insertBefore(inline, ch);
      });
      var last = chapters[chapters.length - 1];
      if (last && last.parentNode) {
        last.parentNode.insertBefore(makeAdSlot('inline'), last.nextSibling);
      }
    } else if (document.querySelector('.hubs') || document.getElementById('grid')) {
      // Library: after shelves / before grid
      var hubs = document.querySelector('.hubs');
      if (hubs && hubs.parentNode) {
        hubs.parentNode.insertBefore(makeAdSlot('inline'), hubs.nextSibling);
      }
    } else if (document.querySelector('.grid') && document.querySelector('.hero')) {
      var grid = document.querySelector('.grid');
      if (grid) grid.parentNode.insertBefore(makeAdSlot('inline'), grid);
    }
  }

  function ensureAccountChip() {
    if (document.getElementById('hx-account-chip')) {
      updateChip();
      return;
    }
    var chip = document.createElement('div');
    chip.id = 'hx-account-chip';
    chip.className = 'hx-account-chip';
    chip.innerHTML = '<span class="hx-badge" id="hx-plus-badge" hidden>Historic+</span>' +
      '<button type="button" class="hx-gear" id="hx-settings-btn" aria-label="Account and subscription">Account</button>';

    var header = document.querySelector('header.app-header');
    if (header) {
      var pill = header.querySelector('.pill');
      if (pill) {
        pill.replaceWith(chip);
      } else {
        header.appendChild(chip);
      }
    } else {
      var topbar = document.querySelector('nav.topbar');
      if (topbar) {
        topbar.appendChild(chip);
      } else {
        chip.style.position = 'fixed';
        chip.style.top = '0.75rem';
        chip.style.right = '0.75rem';
        chip.style.zIndex = '70';
        document.body.appendChild(chip);
      }
    }
    document.getElementById('hx-settings-btn').addEventListener('click', openSettings);
    updateChip();
  }

  function updateChip() {
    var badge = document.getElementById('hx-plus-badge');
    if (!badge) return;
    if (isSubscribed()) {
      badge.hidden = false;
      document.body.classList.add('hx-subscribed');
    } else {
      badge.hidden = true;
      document.body.classList.remove('hx-subscribed');
    }
  }

  function closeModals() {
    document.querySelectorAll('.hx-modal-backdrop,.hx-settings').forEach(function (n) { n.remove(); });
  }

  function openPaywall() {
    closeModals();
    var backdrop = document.createElement('div');
    backdrop.className = 'hx-modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-labelledby', 'hx-paywall-title');
    backdrop.innerHTML =
      '<div class="hx-modal">' +
      '<h2 id="hx-paywall-title">Go ad-free with Historic+</h2>' +
      '<p>Keep the library calm — no banners, same stories, a quiet badge that says you keep this place going.</p>' +
      '<div class="hx-price">' + CONFIG.PRICE_LABEL + ' · cancel anytime</div>' +
      '<div class="hx-modal-actions">' +
      '<button type="button" class="hx-btn-primary" id="hx-subscribe-btn">Start Historic+ (demo)</button>' +
      '<button type="button" class="hx-btn-secondary" id="hx-restore-btn">Restore purchase</button>' +
      '<button type="button" class="hx-btn-ghost" id="hx-paywall-close">Not now</button>' +
      '</div></div>';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closeModals();
    });
    document.getElementById('hx-paywall-close').addEventListener('click', closeModals);
    document.getElementById('hx-subscribe-btn').addEventListener('click', function () {
      subscribeMock('paywall-mock');
      closeModals();
    });
    document.getElementById('hx-restore-btn').addEventListener('click', function () {
      var ent = restore();
      if (ent.subscribed) {
        closeModals();
      } else {
        var hint = document.createElement('p');
        hint.className = 'hx-hint';
        hint.textContent = 'No subscription found on this device yet. Demo subscribe above, or Restore after a real store purchase.';
        var actions = backdrop.querySelector('.hx-modal-actions');
        if (actions && !actions.querySelector('.hx-hint')) actions.insertBefore(hint, actions.firstChild);
      }
    });
  }

  function openSettings() {
    closeModals();
    var ent = readEntitlement();
    var panel = document.createElement('div');
    panel.className = 'hx-settings';
    panel.innerHTML =
      '<div class="hx-settings-panel" role="dialog" aria-modal="true" aria-labelledby="hx-settings-title">' +
      '<h2 id="hx-settings-title">Account</h2>' +
      '<div class="hx-status-row"><span>Status</span><strong>' +
      (ent.subscribed ? 'Historic+ active' : 'Free · ads on') +
      '</strong></div>' +
      '<p class="hx-hint">Mock billing until App Store / Play / Stripe keys are wired. Long-press Status (mobile shell) or use Demo below for screenshots.</p>' +
      '<div class="hx-modal-actions">' +
      (ent.subscribed
        ? '<button type="button" class="hx-btn-secondary" id="hx-manage-cancel">Turn off demo Historic+</button>'
        : '<button type="button" class="hx-btn-primary" id="hx-manage-sub">Go ad-free · ' + CONFIG.PRICE_LABEL + '</button>') +
      '<button type="button" class="hx-btn-secondary" id="hx-manage-restore">Restore</button>' +
      '<button type="button" class="hx-btn-ghost" id="hx-settings-close">Close</button>' +
      '</div></div>';
    document.body.appendChild(panel);
    panel.addEventListener('click', function (e) {
      if (e.target === panel) closeModals();
    });
    document.getElementById('hx-settings-close').addEventListener('click', closeModals);
    var subBtn = document.getElementById('hx-manage-sub');
    if (subBtn) subBtn.addEventListener('click', function () { openPaywall(); });
    var cancelBtn = document.getElementById('hx-manage-cancel');
    if (cancelBtn) cancelBtn.addEventListener('click', function () {
      unsubscribeMock();
      closeModals();
      openSettings();
    });
    document.getElementById('hx-manage-restore').addEventListener('click', function () {
      restore();
      closeModals();
      openSettings();
    });

    // Demo long-press on status for screenshots
    var status = panel.querySelector('.hx-status-row');
    var pressTimer = null;
    status.addEventListener('touchstart', function () {
      pressTimer = setTimeout(function () {
        if (!isSubscribed()) subscribeMock('longpress-demo');
        else unsubscribeMock();
        closeModals();
        openSettings();
      }, 650);
    }, { passive: true });
    status.addEventListener('touchend', function () { clearTimeout(pressTimer); });
    status.addEventListener('mousedown', function () {
      pressTimer = setTimeout(function () {
        if (!isSubscribed()) subscribeMock('longpress-demo');
        else unsubscribeMock();
        closeModals();
        openSettings();
      }, 650);
    });
    status.addEventListener('mouseup', function () { clearTimeout(pressTimer); });
    status.addEventListener('mouseleave', function () { clearTimeout(pressTimer); });
  }

  function refreshUI() {
    updateChip();
    renderAds();
  }

  function onNativeMessage(event) {
    var data = event && event.data;
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch (e) { return; }
    }
    if (!data || !data.type) return;
    if (data.type === 'historic.setEntitlement') {
      applyNativeEntitlement(data.entitlement || data);
    }
    if (data.type === 'historic.openPaywall') openPaywall();
    if (data.type === 'historic.openSettings') openSettings();
  }

  function init() {
    injectStyles();
    ensureAccountChip();
    restore();
    renderAds();
    global.addEventListener('message', onNativeMessage);
    document.addEventListener('message', onNativeMessage); // Android WebView
    postToNative({ type: 'historic.ready', entitlement: readEntitlement() });
  }

  var api = {
    CONFIG: CONFIG,
    isSubscribed: isSubscribed,
    subscribeMock: subscribeMock,
    unsubscribeMock: unsubscribeMock,
    restore: restore,
    openPaywall: openPaywall,
    openSettings: openSettings,
    renderAds: renderAds,
    applyNativeEntitlement: applyNativeEntitlement,
    getEntitlement: readEntitlement,
    init: init
  };

  global.HistoricMonetization = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : this);
