/*! Historic story enhancements — chapter auto-play, Continue CTA, ambient, film clarity */
(function (global) {
  'use strict';

  var reduceMotion = false;
  try {
    reduceMotion = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  var chapterTimer = null;
  var userInteracting = false;
  var interactReset = null;
  var CHAPTER_MS = 9000;
  var lastAutoIdx = -1;

  function prefs() {
    if (global.HistoricNarrator && global.HistoricNarrator.getPrefs) {
      return global.HistoricNarrator.getPrefs();
    }
    try {
      return Object.assign({ autoPlayChapters: false, autoReadChapter: false, enabled: false },
        JSON.parse(localStorage.getItem('historic_narrator') || '{}'));
    } catch (e) {
      return { autoPlayChapters: false, autoReadChapter: false, enabled: false };
    }
  }

  function ensureChapterIds(chapters) {
    chapters.forEach(function (ch, i) {
      if (!ch.id) ch.id = 'ch' + (i + 1);
      if (!ch.getAttribute('data-chapter')) ch.setAttribute('data-chapter', String(i + 1));
    });
  }

  function ensureProgressDots(chapters) {
    var wrap = document.querySelector('.progress-dots');
    if (!chapters.length) return wrap;
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'progress-dots';
      wrap.setAttribute('role', 'navigation');
      wrap.setAttribute('aria-label', 'Chapters');
      var hero = document.querySelector('.hero');
      var main = document.querySelector('main.chapters, .chapters');
      if (hero && hero.parentNode) hero.parentNode.insertBefore(wrap, hero.nextSibling);
      else if (main && main.parentNode) main.parentNode.insertBefore(wrap, main);
      else document.body.insertBefore(wrap, document.body.firstChild);
    }
    var dots = [].slice.call(wrap.querySelectorAll('.dot'));
    if (dots.length !== chapters.length) {
      wrap.innerHTML = '';
      chapters.forEach(function (ch, i) {
        var btn = document.createElement('button');
        btn.className = 'dot';
        btn.type = 'button';
        btn.setAttribute('data-target', ch.id);
        btn.setAttribute('aria-label', 'Chapter ' + (i + 1));
        btn.addEventListener('click', function () {
          markUserInteract();
          ch.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        });
        wrap.appendChild(btn);
      });
    } else {
      dots.forEach(function (d) {
        if (d._nrBound) return;
        d._nrBound = true;
        d.addEventListener('click', function () { markUserInteract(); });
      });
    }
    return wrap;
  }

  function setActiveDot(id) {
    var dots = document.querySelectorAll('.progress-dots .dot');
    dots.forEach(function (d) {
      d.classList.toggle('active', d.getAttribute('data-target') === id);
    });
  }

  function ensureContinueCTA(chapters) {
    if (!chapters.length) return;
    chapters.forEach(function (ch, i) {
      var existing = ch.querySelector('.story-continue');
      if (i >= chapters.length - 1) {
        if (existing) existing.remove();
        return;
      }
      if (existing) return;
      var next = chapters[i + 1];
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'story-continue';
      btn.setAttribute('aria-label', 'Continue to next chapter');
      btn.innerHTML = 'Continue <span aria-hidden="true">→</span>';
      btn.addEventListener('click', function () {
        markUserInteract();
        next.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      });
      ch.appendChild(btn);
    });
  }

  function markUserInteract() {
    userInteracting = true;
    clearTimeout(interactReset);
    interactReset = setTimeout(function () { userInteracting = false; }, 4000);
    clearTimeout(chapterTimer);
    chapterTimer = null;
  }

  function currentChapterIndex(chapters) {
    var best = 0;
    var bestRatio = -1;
    var vh = window.innerHeight || 1;
    chapters.forEach(function (ch, i) {
      var r = ch.getBoundingClientRect();
      var visible = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
      var ratio = visible / Math.min(r.height || 1, vh);
      if (ratio > bestRatio) { bestRatio = ratio; best = i; }
    });
    return best;
  }

  function scheduleAutoPlay(chapters) {
    clearTimeout(chapterTimer);
    chapterTimer = null;
    if (reduceMotion) return;
    var p = prefs();
    if (!p.autoPlayChapters || userInteracting) return;
    var idx = currentChapterIndex(chapters);
    chapterTimer = setTimeout(function () {
      if (userInteracting || !prefs().autoPlayChapters) return;
      var i = currentChapterIndex(chapters);
      if (i < chapters.length - 1) {
        chapters[i + 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, CHAPTER_MS);
  }

  function maybeAutoRead(chapter) {
    var p = prefs();
    if (!p.enabled || !p.autoReadChapter) return;
    if (!global.HistoricNarrator) return;
    // Avoid loops: only when chapter id changes
    var id = chapter && chapter.id;
    if (!id || id === maybeAutoRead._last) return;
    maybeAutoRead._last = id;
    // iOS may block without gesture — try; user can tap Play
    try {
      var text = (chapter.innerText || '').replace(/\s+/g, ' ').trim();
      if (text && global.HistoricNarrator.speakText) {
        global.HistoricNarrator.speakText(text, false);
      }
    } catch (e) {}
  }
  maybeAutoRead._last = '';

  function addAmbient(chapters) {
    if (reduceMotion) {
      document.documentElement.classList.add('nr-reduce-motion');
      return;
    }
    document.documentElement.classList.add('nr-ambient-on');
    chapters.forEach(function (ch) {
      if (!ch.querySelector('.nr-ink-line')) {
        var line = document.createElement('span');
        line.className = 'nr-ink-line';
        line.setAttribute('aria-hidden', 'true');
        ch.insertBefore(line, ch.firstChild);
      }
    });
  }

  function enhanceTopicPage() {
    var chapters = [].slice.call(document.querySelectorAll('.chapter'));
    if (!chapters.length) return false;

    ensureChapterIds(chapters);
    ensureProgressDots(chapters);
    ensureContinueCTA(chapters);
    addAmbient(chapters);

    // Entrance: respect existing IO; reinforce in-view
    if (!reduceMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            setActiveDot(e.target.id);
            maybeAutoRead(e.target);
            scheduleAutoPlay(chapters);
          }
        });
      }, { threshold: 0.4 });
      chapters.forEach(function (c) { io.observe(c); });
      if (chapters[0]) {
        chapters[0].classList.add('in-view');
        setActiveDot(chapters[0].id);
      }
    } else {
      chapters.forEach(function (c) { c.classList.add('in-view'); });
    }

    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (evt) {
      window.addEventListener(evt, markUserInteract, { passive: true });
    });

    global.addEventListener('historic:narrator-prefs', function () {
      scheduleAutoPlay(chapters);
    });

    // Story controls chip near progress dots
    var dots = document.querySelector('.progress-dots');
    if (dots && !document.getElementById('nr-story-chip')) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.id = 'nr-story-chip';
      chip.className = 'story-controls-chip';
      chip.setAttribute('aria-pressed', prefs().autoPlayChapters ? 'true' : 'false');
      chip.textContent = 'Auto-play chapters';
      chip.addEventListener('click', function () {
        if (reduceMotion) return;
        var p = prefs();
        var next = !p.autoPlayChapters;
        if (global.HistoricNarrator && global.HistoricNarrator.setPrefs) {
          global.HistoricNarrator.setPrefs({ autoPlayChapters: next });
        } else {
          try {
            var raw = Object.assign({}, p, { autoPlayChapters: next });
            localStorage.setItem('historic_narrator', JSON.stringify(raw));
          } catch (e) {}
        }
        chip.setAttribute('aria-pressed', next ? 'true' : 'false');
        if (next) scheduleAutoPlay(chapters);
        else { clearTimeout(chapterTimer); chapterTimer = null; }
      });
      dots.appendChild(chip);
    }

    return true;
  }

  function enhanceFilms() {
    var scenes = document.querySelectorAll('.scene');
    var btnPlay = document.getElementById('btnPlay');
    if (!scenes.length || !btnPlay) return false;

    // Clearer Auto-play labeling without breaking handlers
    function syncLabel() {
      var label = (btnPlay.getAttribute('aria-label') || '').toLowerCase();
      var text = (btnPlay.textContent || '').toLowerCase();
      var isPause = label.indexOf('pause') !== -1 || text.indexOf('pause') !== -1 || text.indexOf('❚') !== -1;
      if (isPause) {
        if (btnPlay.textContent.indexOf('Auto') === -1 && btnPlay.textContent.indexOf('Pause') !== -1) {
          btnPlay.innerHTML = '❚❚ Pause auto-play';
        }
        btnPlay.setAttribute('aria-label', 'Pause auto-play');
      } else {
        if (btnPlay.textContent.indexOf('Play') !== -1 || btnPlay.textContent.indexOf('▶') !== -1) {
          btnPlay.innerHTML = '▶ Auto-play';
        }
        btnPlay.setAttribute('aria-label', 'Start auto-play scenes');
        btnPlay.setAttribute('title', 'Auto-play scenes (Space)');
      }
    }

    syncLabel();
    var mo = new MutationObserver(syncLabel);
    mo.observe(btnPlay, { childList: true, characterData: true, subtree: true, attributes: true });

    // Hint under controls once
    var controls = document.querySelector('.controls');
    if (controls && !document.getElementById('nr-film-hint')) {
      var hint = document.createElement('p');
      hint.id = 'nr-film-hint';
      hint.className = 'nr-film-hint';
      hint.textContent = 'Auto-play advances scenes on a timer. Pause anytime — existing controls unchanged.';
      controls.parentNode.insertBefore(hint, controls.nextSibling);
    }

    if (reduceMotion) {
      // Don't force-start; films already respect reduced motion in CSS
      var note = document.getElementById('nr-film-hint');
      if (note) note.textContent = 'Reduced motion is on — use Next to advance scenes manually.';
    }

    return true;
  }

  function init() {
    enhanceTopicPage();
    enhanceFilms();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : this);
