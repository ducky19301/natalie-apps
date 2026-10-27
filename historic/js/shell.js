/*! Historic shell — shared include for Narrator + story enhance (+ optional monetization) */
(function () {
  'use strict';

  var me = document.currentScript;
  if (!me || !me.src) {
    var scripts = document.getElementsByTagName('script');
    me = scripts[scripts.length - 1];
  }
  var src = (me && me.src) || '';
  var base = src.replace(/\/js\/shell\.js(\?.*)?$/i, '/');
  if (!base || base === src) {
    // Fallback: infer from path depth
    var path = location.pathname || '';
    if (/\/(stories|categories|ages)\//.test(path)) base = '../';
    else base = './';
    // normalize to absolute-ish relative
    base = new URL(base, location.href).href;
  }

  function abs(rel) {
    try { return new URL(rel, base).href; }
    catch (e) { return base + rel.replace(/^\.\//, ''); }
  }

  function loadCSS(href) {
    if (document.querySelector('link[data-historic-shell="' + href + '"]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-historic-shell', href);
    document.head.appendChild(link);
  }

  function loadJS(href, attrs) {
    if (document.querySelector('script[data-historic-shell="' + href + '"]')) {
      return Promise.resolve();
    }
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = href;
      s.defer = true;
      s.setAttribute('data-historic-shell', href);
      if (attrs) Object.keys(attrs).forEach(function (k) { s.setAttribute(k, attrs[k]); });
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('Failed ' + href)); };
      document.head.appendChild(s);
    });
  }

  loadCSS(abs('css/narrator.css'));
  // Extra story UX styles live in topic.css; also inject a tiny enhance sheet
  loadCSS(abs('css/story-enhance.css'));

  // Narrator first, then story enhance (depends on prefs API)
  function monetizationAlreadyPresent() {
    if (window.HistoricMonetization) return true;
    var nodes = document.querySelectorAll('script[src*="monetization.js"]');
    return nodes.length > 0;
  }

  loadJS(abs('js/narrator.js'))
    .then(function () { return loadJS(abs('js/story-enhance.js')); })
    .then(function () {
      // Coexist: only load monetization if not already on the page
      if (monetizationAlreadyPresent()) return;
      return loadJS(abs('js/monetization.js')).catch(function () { /* optional */ });
    })
    .catch(function (err) {
      if (typeof console !== 'undefined') console.warn('[Historic shell]', err);
    });
})();
