/*! Historic Narrator — Web Speech API reader (shared)
 * Human-paced chunks, recommended voices, persona presets.
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'historic_narrator';
  var DEFAULTS = {
    enabled: false,
    voiceURI: '',
    rate: 0.92,
    pitch: 1,
    persona: 'storyteller',
    autoReadChapter: false,
    autoPlayChapters: false
  };

  var PERSONAS = {
    storyteller: { label: 'Storyteller', rate: 0.92, pitch: 1.02 },
    scholar: { label: 'Scholar', rate: 0.98, pitch: 1.0 },
    campfire: { label: 'Campfire', rate: 0.85, pitch: 0.92 }
  };

  var PREMIUM_VOICE_RE =
    /\b(samantha|karen|daniel|moira|nicky|serena|karen|fiona|tessa|veena|rishi|aaron|fred|kathy|victoria|alex|siri|aria|jenny|guy|sara|ryan|sonia|natasha|hazel|susan|zira|mark|david|linda|google\s*(us|uk|english)|microsoft.*(neural|aria|jenny|guy|sara)|natural|enhanced|premium|neural|wavenet|studio)\b/i;

  var synth = global.speechSynthesis || null;
  var state = {
    open: false,
    speaking: false,
    paused: false,
    utterance: null,
    prefs: loadPrefs(),
    voices: [],
    queue: [],
    queueToken: 0,
    pauseTimer: null,
    betweenChunks: false
  };
  var els = {};
  var reduceMotion = false;

  try {
    reduceMotion = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  function loadPrefs() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return Object.assign({}, DEFAULTS);
      var parsed = JSON.parse(raw);
      var merged = Object.assign({}, DEFAULTS, parsed || {});
      // Migrate legacy default rate 1 → storytelling pace only when still exactly 1 and no persona saved
      if (parsed && parsed.rate === undefined) merged.rate = DEFAULTS.rate;
      if (!merged.persona || !PERSONAS[merged.persona]) merged.persona = 'storyteller';
      return merged;
    } catch (e) {
      return Object.assign({}, DEFAULTS);
    }
  }

  function savePrefs() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        enabled: !!state.prefs.enabled,
        voiceURI: state.prefs.voiceURI || '',
        rate: Number(state.prefs.rate) || DEFAULTS.rate,
        pitch: Number(state.prefs.pitch) || DEFAULTS.pitch,
        persona: state.prefs.persona || 'storyteller',
        autoReadChapter: !!state.prefs.autoReadChapter,
        autoPlayChapters: !!state.prefs.autoPlayChapters
      }));
    } catch (e) {}
    global.dispatchEvent(new CustomEvent('historic:narrator-prefs', { detail: Object.assign({}, state.prefs) }));
  }

  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function getMainText() {
    var roots = [
      document.querySelector('main.chapters'),
      document.querySelector('.chapters'),
      document.querySelector('.scene.active .scene-content'),
      document.querySelector('.scene.active'),
      document.querySelector('main'),
      document.querySelector('.hero'),
      document.body
    ];
    var root = null;
    for (var i = 0; i < roots.length; i++) {
      if (roots[i]) { root = roots[i]; break; }
    }
    if (!root) return '';

    var activeChapter = document.querySelector('.chapter.in-view') ||
      document.querySelector('.chapter.is-current') ||
      document.querySelector('.chapter');
    if (activeChapter && root.contains(activeChapter)) {
      root = activeChapter;
    }

    var clone = root.cloneNode(true);
    var kill = clone.querySelectorAll('script, style, nav, .progress-dots, .historic-narrator-panel, .historic-narrator-fab, .story-continue, .nr-skip, button, .footer-nav');
    for (var k = 0; k < kill.length; k++) kill[k].remove();
    var text = (clone.innerText || clone.textContent || '').replace(/\s+/g, ' ').trim();
    return text;
  }

  /* —— Voice ranking —— */
  function voiceScore(v) {
    var name = (v.name || '') + ' ' + (v.voiceURI || '');
    var lang = (v.lang || '').toLowerCase();
    var score = 0;
    if (!/^en/.test(lang)) return -1000 + (lang ? 1 : 0);

    if (PREMIUM_VOICE_RE.test(name)) score += 100;
    if (/\b(samantha|nicky|moira|karen|daniel|aria|jenny)\b/i.test(name)) score += 40;
    if (/\b(neural|natural|enhanced|premium|wavenet|studio)\b/i.test(name)) score += 35;
    if (/en-US|en_US/i.test(lang)) score += 12;
    if (/en-GB|en_GB|en-AU|en_AU|en-IE|en_IE/i.test(lang)) score += 10;
    if (v.localService === false) score += 8; // often cloud / higher quality on Chromium
    if (v.default) score += 3;
    // Prefer named human voices over generic "Google US English" only slightly after premium boost
    if (/compact|eloquence|novelty|whisper|zarvox|trinoids|boing|bad\s*news|bells|bubbles|cellos|good\s*news|organ|princess|ralph|superstar/i.test(name)) {
      score -= 80;
    }
    return score;
  }

  function rankedVoices() {
    var list = (state.voices || []).slice();
    list.sort(function (a, b) {
      var d = voiceScore(b) - voiceScore(a);
      if (d) return d;
      return String(a.name || '').localeCompare(String(b.name || ''));
    });
    return list;
  }

  function pickBestEnglishVoice() {
    var ranked = rankedVoices();
    for (var i = 0; i < ranked.length; i++) {
      if (voiceScore(ranked[i]) > -500) return ranked[i];
    }
    return ranked[0] || null;
  }

  function selectedVoice() {
    if (!state.voices.length) return null;
    if (state.prefs.voiceURI) {
      for (var i = 0; i < state.voices.length; i++) {
        if (state.voices[i].voiceURI === state.prefs.voiceURI) return state.voices[i];
      }
    }
    return pickBestEnglishVoice();
  }

  function refreshVoices() {
    if (!synth) return;
    state.voices = synth.getVoices() || [];
    if (!els.voice) return;
    var prev = state.prefs.voiceURI;
    var ranked = rankedVoices();
    els.voice.innerHTML = '';
    if (!ranked.length) {
      var opt0 = document.createElement('option');
      opt0.value = '';
      opt0.textContent = 'No voices yet — tap Play after a moment';
      els.voice.appendChild(opt0);
      return;
    }

    // Auto-pick best English if no saved voiceURI
    if (!prev) {
      var best = pickBestEnglishVoice();
      if (best) {
        state.prefs.voiceURI = best.voiceURI;
        prev = best.voiceURI;
        savePrefs();
      }
    }

    var recommended = document.createElement('optgroup');
    recommended.label = 'Recommended';
    var other = document.createElement('optgroup');
    other.label = 'Other voices';
    var recCount = 0;

    ranked.forEach(function (v) {
      var opt = document.createElement('option');
      opt.value = v.voiceURI;
      var badge = voiceScore(v) >= 100 ? ' ★' : '';
      opt.textContent = (v.name || 'Voice') + (v.lang ? ' (' + v.lang + ')' : '') + badge;
      if (v.voiceURI === prev) opt.selected = true;
      // Top English / premium-ish into Recommended (score >= 10 or first few English)
      if (voiceScore(v) >= 10 && recCount < 12) {
        recommended.appendChild(opt);
        recCount++;
      } else {
        other.appendChild(opt);
      }
    });

    if (recommended.childNodes.length) els.voice.appendChild(recommended);
    if (other.childNodes.length) els.voice.appendChild(other);

    if (prev && els.voice.value !== prev) {
      var missing = document.createElement('option');
      missing.value = prev;
      missing.textContent = 'Saved voice';
      missing.selected = true;
      els.voice.insertBefore(missing, els.voice.firstChild);
    }
  }

  /* —— Spoken-style rewrite (does not change on-page text) —— */
  function toSpokenStyle(text) {
    var t = String(text || '');
    // Strip URL-bearing parentheticals and bare URLs
    t = t.replace(/\(\s*(?:see|via|from|source)?\s*https?:\/\/[^)]+\)/gi, '');
    t = t.replace(/https?:\/\/\S+/gi, '');
    t = t.replace(/\bwww\.\S+/gi, '');
    // Light citation brackets [1], [note] — keep era markers
    t = t.replace(/\[\s*\d+[a-z]?\s*\]/gi, '');
    t = t.replace(/\[\s*[^\]]{0,40}\s*\]/g, function (m) {
      if (/bce|ce|\bad\b|\bbc\b|circa/i.test(m)) return m;
      return '';
    });
    t = t.replace(/\(\s*p\.\s*\d+\s*\)/gi, '');
    // Expand a few abbreviations (keep BCE/CE)
    t = t.replace(/\be\.g\./gi, 'for example');
    t = t.replace(/\bi\.e\./gi, 'that is');
    t = t.replace(/\bvs\./gi, 'versus');
    t = t.replace(/\betc\./gi, 'and so on');
    t = t.replace(/\bapprox\./gi, 'approximately');
    // c. / ca. before years → circa
    t = t.replace(/\bc\.\s*(?=\d)/gi, 'circa ');
    t = t.replace(/\bca\.\s*(?=\d)/gi, 'circa ');
    // Soften list dumps: semicolons → breath commas; colons → sentence break
    t = t.replace(/\s*;\s*/g, ', ');
    t = t.replace(/:\s+/g, '. ');
    // Em/en dashes as brief pauses
    t = t.replace(/\s*[—–]\s*/g, ', ');
    // Tidy empty parens / leftover punctuation from stripping
    t = t.replace(/\(\s*\)/g, '');
    t = t.replace(/\s+([,.;])/g, '$1');
    t = t.replace(/([.!?]){2,}/g, '$1');
    t = t.replace(/\s+/g, ' ').trim();
    // Ensure "for example" starts cleanly after a period
    t = t.replace(/\.\s*for example\b/gi, '. For example,');
    t = t.replace(/\bFor example(?!,)\b/g, 'For example,');
    return t;
  }

  function splitSentences(text) {
    // Avoid lookbehind for older Safari; keep terminator with the sentence
    var parts = [];
    var re = /[^.!?…]+(?:[.!?…]+|$)/g;
    var m;
    while ((m = re.exec(text)) !== null) {
      var s = m[0].trim();
      if (s) parts.push(s);
    }
    if (!parts.length && text.trim()) parts = [text.trim()];
    return parts;
  }

  function chunkForSpeech(text) {
    var spoken = toSpokenStyle(text);
    if (!spoken) return [];
    var sentences = splitSentences(spoken);
    var chunks = [];
    var MIN = 120;
    var MAX = 180;

    sentences.forEach(function (sentence) {
      if (sentence.length <= MAX) {
        // Soften long comma lists by inserting light pauses via chunking
        if (sentence.length > MIN && (sentence.match(/,/g) || []).length >= 3) {
          var bits = sentence.split(/,\s+/);
          var buf = '';
          bits.forEach(function (bit, i) {
            var next = buf ? buf + ', ' + bit : bit;
            if (next.length > MAX && buf) {
              chunks.push(buf.trim());
              buf = bit;
            } else {
              buf = next;
            }
            if (i === bits.length - 1 && buf) chunks.push(buf.trim());
          });
        } else {
          chunks.push(sentence);
        }
        return;
      }
      // Long sentence: split on commas / conjunctions into ~120–180 char clauses
      var clauses = sentence.split(/(?<=,)\s+|\s+(?=and\s|but\s|or\s|which\s|that\s)/i);
      var buf2 = '';
      clauses.forEach(function (cl) {
        cl = cl.trim();
        if (!cl) return;
        if (!buf2) {
          buf2 = cl;
        } else if ((buf2 + ' ' + cl).length <= MAX) {
          buf2 = buf2 + ' ' + cl;
        } else {
          if (buf2.length < 40 && chunks.length) {
            // Merge tiny leftovers with previous if still reasonable
            var last = chunks[chunks.length - 1];
            if ((last + ' ' + buf2).length <= MAX + 40) {
              chunks[chunks.length - 1] = last + ' ' + buf2;
            } else {
              chunks.push(buf2);
            }
          } else {
            chunks.push(buf2);
          }
          buf2 = cl;
        }
      });
      if (buf2) chunks.push(buf2);
    });

    // Merge tiny trailing fragments only (keep real sentences separate)
    var merged = [];
    chunks.forEach(function (c) {
      var prev = merged.length ? merged[merged.length - 1] : '';
      var prevDone = /[.!?…]"?'?$/.test(prev);
      if (merged.length && c.length < 28 && !prevDone && (prev.length + c.length) < MAX) {
        merged[merged.length - 1] += ', ' + c;
      } else {
        merged.push(c);
      }
    });
    return merged.filter(Boolean);
  }

  function microVary(base, delta) {
    var n = Number(base);
    if (!isFinite(n)) n = 1;
    var jitter = (Math.random() * 2 - 1) * delta;
    return Math.max(0.5, Math.min(2, n + jitter));
  }

  function clearPauseTimer() {
    if (state.pauseTimer) {
      clearTimeout(state.pauseTimer);
      state.pauseTimer = null;
    }
    state.betweenChunks = false;
  }

  function setStatus(msg) {
    if (els.status) els.status.textContent = msg || '';
  }

  function updateUI() {
    if (els.fab) {
      els.fab.classList.toggle('is-on', !!state.prefs.enabled);
      els.fab.classList.toggle('is-speaking', state.speaking && !state.paused);
      els.fab.setAttribute('aria-expanded', state.open ? 'true' : 'false');
    }
    if (els.panel) els.panel.classList.toggle('is-open', state.open);
    if (els.onBtn) els.onBtn.setAttribute('aria-pressed', state.prefs.enabled ? 'true' : 'false');
    if (els.offBtn) els.offBtn.setAttribute('aria-pressed', state.prefs.enabled ? 'false' : 'true');
    if (els.rate) els.rate.value = String(state.prefs.rate);
    if (els.rateVal) els.rateVal.textContent = Number(state.prefs.rate).toFixed(2);
    if (els.pitch) els.pitch.value = String(state.prefs.pitch);
    if (els.pitchVal) els.pitchVal.textContent = Number(state.prefs.pitch).toFixed(2);
    if (els.autoRead) els.autoRead.setAttribute('aria-pressed', state.prefs.autoReadChapter ? 'true' : 'false');
    if (els.autoPlay) els.autoPlay.setAttribute('aria-pressed', state.prefs.autoPlayChapters ? 'true' : 'false');
    if (els.play) els.play.disabled = !state.prefs.enabled || !synth;
    if (els.pause) els.pause.disabled = !state.prefs.enabled || (!state.speaking && !state.betweenChunks);
    if (els.stop) els.stop.disabled = !state.prefs.enabled || (!state.speaking && !state.paused && !state.queue.length && !state.betweenChunks);
    updatePersonaUI();
  }

  function updatePersonaUI() {
    if (!els.personaRow) return;
    var buttons = els.personaRow.querySelectorAll('[data-persona]');
    for (var i = 0; i < buttons.length; i++) {
      var id = buttons[i].getAttribute('data-persona');
      buttons[i].setAttribute('aria-pressed', id === state.prefs.persona ? 'true' : 'false');
    }
  }

  function applyPersona(id, announce) {
    var p = PERSONAS[id];
    if (!p) return;
    state.prefs.persona = id;
    state.prefs.rate = p.rate;
    state.prefs.pitch = p.pitch;
    savePrefs();
    updateUI();
    if (announce !== false) setStatus(p.label + ' voice — rate ' + p.rate.toFixed(2) + ', pitch ' + p.pitch.toFixed(2));
  }

  function stopSpeech() {
    if (!synth) return;
    state.queueToken++;
    state.queue = [];
    clearPauseTimer();
    try { synth.cancel(); } catch (e) {}
    state.speaking = false;
    state.paused = false;
    state.utterance = null;
    updateUI();
  }

  function pauseSpeech() {
    if (!synth) return;
    if (state.betweenChunks) {
      clearPauseTimer();
      state.paused = true;
      state.speaking = true; // still in a reading session
      setStatus('Paused');
      updateUI();
      return;
    }
    if (!state.speaking) return;
    try { synth.pause(); } catch (e) {}
    state.paused = true;
    setStatus('Paused');
    updateUI();
  }

  function resumeSpeech() {
    if (!synth) return;
    if (!state.paused) return false;
    state.paused = false;
    if (state.queue.length && !state.utterance) {
      // Was paused between chunks — continue queue
      setStatus('Reading…');
      updateUI();
      speakNextChunk(state.queueToken);
      return true;
    }
    try { synth.resume(); } catch (e) {}
    setStatus('Reading…');
    updateUI();
    return true;
  }

  function speakNextChunk(token) {
    if (token !== state.queueToken) return;
    if (state.paused) return;
    if (!state.queue.length) {
      state.speaking = false;
      state.paused = false;
      state.utterance = null;
      setStatus('Finished');
      updateUI();
      global.dispatchEvent(new CustomEvent('historic:narrator-ended'));
      return;
    }

    var chunk = state.queue.shift();
    var u = new SpeechSynthesisUtterance(chunk);
    var voice = selectedVoice();
    if (voice) u.voice = voice;
    u.rate = microVary(state.prefs.rate, 0.03);
    u.pitch = microVary(state.prefs.pitch, 0.05);

    u.onstart = function () {
      if (token !== state.queueToken) return;
      state.speaking = true;
      state.paused = false;
      setStatus('Reading…');
      updateUI();
    };

    u.onend = function () {
      if (token !== state.queueToken) return;
      state.utterance = null;
      if (!state.queue.length) {
        state.speaking = false;
        state.paused = false;
        setStatus('Finished');
        updateUI();
        global.dispatchEvent(new CustomEvent('historic:narrator-ended'));
        return;
      }
      // Short breath pause between chunks (200–450ms)
      var delay = 200 + Math.floor(Math.random() * 251);
      state.betweenChunks = true;
      state.pauseTimer = setTimeout(function () {
        state.pauseTimer = null;
        state.betweenChunks = false;
        if (token !== state.queueToken) return;
        if (state.paused) return;
        speakNextChunk(token);
      }, delay);
      updateUI();
    };

    u.onerror = function (ev) {
      if (token !== state.queueToken) return;
      state.utterance = null;
      if (ev && ev.error === 'canceled') {
        state.speaking = false;
        state.paused = false;
        state.queue = [];
        clearPauseTimer();
        setStatus('');
        updateUI();
        return;
      }
      // interrupted / network — try to continue queue
      if (state.queue.length && !state.paused) {
        speakNextChunk(token);
        return;
      }
      state.speaking = false;
      state.paused = false;
      setStatus('Speech interrupted');
      updateUI();
    };

    state.utterance = u;
    try {
      synth.speak(u);
      if (synth.paused) synth.resume();
    } catch (err) {
      setStatus('Could not start speech. Tap Play again.');
      state.speaking = false;
      updateUI();
    }
  }

  function speakText(text, fromGesture) {
    if (!synth || !state.prefs.enabled) return;
    text = (text || '').trim();
    if (!text) {
      setStatus('Nothing to read on this page.');
      return;
    }
    // iOS: must start from user gesture; cancel+speak in same tick after tap
    stopSpeech();
    refreshVoices();

    var chunks = chunkForSpeech(text);
    if (!chunks.length) {
      setStatus('Nothing to read on this page.');
      return;
    }

    state.queue = chunks;
    state.queueToken++;
    var token = state.queueToken;
    state.speaking = true;
    state.paused = false;
    setStatus('Reading…');
    updateUI();
    speakNextChunk(token);
  }

  function playFromButton() {
    if (!state.prefs.enabled) {
      state.prefs.enabled = true;
      savePrefs();
    }
    if (resumeSpeech()) return;
    speakText(getMainText(), true);
  }

  function setEnabled(on) {
    state.prefs.enabled = !!on;
    savePrefs();
    if (!on) stopSpeech();
    updateUI();
    setStatus(on ? 'Narrator on — tap Play to read (needed on iOS).' : 'Narrator off');
  }

  function buildUI() {
    if (document.getElementById('historic-narrator-root')) return;

    var root = document.createElement('div');
    root.id = 'historic-narrator-root';
    root.innerHTML =
      '<button type="button" class="historic-narrator-fab" id="nr-fab" aria-controls="nr-panel" aria-expanded="false" aria-label="Open Narrator panel">' +
        '<span class="nr-fab-dot" aria-hidden="true"></span> Narrator' +
      '</button>' +
      '<div class="historic-narrator-panel" id="nr-panel" role="dialog" aria-label="Narrator controls" aria-modal="false" hidden>' +
        '<button type="button" class="nr-close" id="nr-close" aria-label="Close Narrator panel">×</button>' +
        '<h2 class="nr-title">Narrator</h2>' +
        '<p class="nr-sub">Reads this page aloud with your device voices — paced like a person, not a robot.</p>' +
        '<div class="nr-row">' +
          '<span class="nr-label" id="nr-master-label">Master</span>' +
          '<div class="nr-toggle" role="group" aria-labelledby="nr-master-label">' +
            '<button type="button" id="nr-on" aria-pressed="false">On</button>' +
            '<button type="button" id="nr-off" aria-pressed="true">Off</button>' +
          '</div>' +
        '</div>' +
        '<div class="nr-field">' +
          '<span class="nr-label" id="nr-persona-label">Persona</span>' +
          '<div class="nr-persona-row" id="nr-persona-row" role="group" aria-labelledby="nr-persona-label">' +
            '<button type="button" class="nr-persona" data-persona="storyteller" aria-pressed="true">Storyteller</button>' +
            '<button type="button" class="nr-persona" data-persona="scholar" aria-pressed="false">Scholar</button>' +
            '<button type="button" class="nr-persona" data-persona="campfire" aria-pressed="false">Campfire</button>' +
          '</div>' +
        '</div>' +
        '<div class="nr-field">' +
          '<label class="nr-label" for="nr-voice">Voice</label>' +
          '<select id="nr-voice" aria-label="Choose voice"></select>' +
        '</div>' +
        '<div class="nr-field">' +
          '<label class="nr-label" for="nr-rate">Rate</label>' +
          '<input id="nr-rate" type="range" min="0.5" max="1.8" step="0.05" value="0.92" aria-valuemin="0.5" aria-valuemax="1.8" aria-label="Speech rate">' +
          '<div class="nr-range-meta"><span>Slow</span><span id="nr-rate-val">0.92</span><span>Fast</span></div>' +
        '</div>' +
        '<div class="nr-field">' +
          '<label class="nr-label" for="nr-pitch">Pitch</label>' +
          '<input id="nr-pitch" type="range" min="0.5" max="1.8" step="0.05" value="1" aria-valuemin="0.5" aria-valuemax="1.8" aria-label="Speech pitch">' +
          '<div class="nr-range-meta"><span>Low</span><span id="nr-pitch-val">1.00</span><span>High</span></div>' +
        '</div>' +
        '<div class="nr-controls">' +
          '<button type="button" class="primary" id="nr-play" aria-label="Play narration">Play</button>' +
          '<button type="button" id="nr-pause" aria-label="Pause narration">Pause</button>' +
          '<button type="button" id="nr-stop" aria-label="Stop narration">Stop</button>' +
        '</div>' +
        '<div class="nr-chip-row">' +
          '<button type="button" class="nr-chip" id="nr-auto-read" aria-pressed="false" title="When On, entering a chapter can start reading after you enable Narrator">Auto-read chapter</button>' +
          '<button type="button" class="nr-chip" id="nr-auto-play" aria-pressed="false" title="Advance chapters on a timer">Auto-play chapters</button>' +
        '</div>' +
        '<p class="nr-status" id="nr-status" role="status" aria-live="polite"></p>' +
        '<p class="nr-tip">Tip: on iPhone, pick Samantha / Nicky if available — sounds more human.</p>' +
        '<p class="nr-ios-note">On iOS Safari, speech must start from a tap — use Play. Voices load after first interaction.</p>' +
      '</div>';

    document.body.appendChild(root);

    els.fab = document.getElementById('nr-fab');
    els.panel = document.getElementById('nr-panel');
    els.close = document.getElementById('nr-close');
    els.onBtn = document.getElementById('nr-on');
    els.offBtn = document.getElementById('nr-off');
    els.voice = document.getElementById('nr-voice');
    els.rate = document.getElementById('nr-rate');
    els.rateVal = document.getElementById('nr-rate-val');
    els.pitch = document.getElementById('nr-pitch');
    els.pitchVal = document.getElementById('nr-pitch-val');
    els.play = document.getElementById('nr-play');
    els.pause = document.getElementById('nr-pause');
    els.stop = document.getElementById('nr-stop');
    els.autoRead = document.getElementById('nr-auto-read');
    els.autoPlay = document.getElementById('nr-auto-play');
    els.status = document.getElementById('nr-status');
    els.personaRow = document.getElementById('nr-persona-row');

    els.panel.hidden = true;

    els.fab.addEventListener('click', function () {
      state.open = !state.open;
      els.panel.hidden = !state.open;
      updateUI();
      if (state.open) {
        refreshVoices();
        els.onBtn.focus();
      } else {
        els.fab.focus();
      }
    });

    els.close.addEventListener('click', function () {
      state.open = false;
      els.panel.hidden = true;
      updateUI();
      els.fab.focus();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && state.open) {
        state.open = false;
        els.panel.hidden = true;
        updateUI();
        els.fab.focus();
      }
    });

    els.onBtn.addEventListener('click', function () { setEnabled(true); });
    els.offBtn.addEventListener('click', function () { setEnabled(false); });

    if (els.personaRow) {
      els.personaRow.addEventListener('click', function (e) {
        var btn = e.target && e.target.closest ? e.target.closest('[data-persona]') : null;
        if (!btn) return;
        applyPersona(btn.getAttribute('data-persona'));
      });
    }

    els.voice.addEventListener('change', function () {
      state.prefs.voiceURI = els.voice.value;
      savePrefs();
    });
    els.rate.addEventListener('input', function () {
      state.prefs.rate = parseFloat(els.rate.value) || DEFAULTS.rate;
      els.rateVal.textContent = Number(state.prefs.rate).toFixed(2);
      savePrefs();
    });
    els.pitch.addEventListener('input', function () {
      state.prefs.pitch = parseFloat(els.pitch.value) || DEFAULTS.pitch;
      els.pitchVal.textContent = Number(state.prefs.pitch).toFixed(2);
      savePrefs();
    });

    els.play.addEventListener('click', playFromButton);
    els.pause.addEventListener('click', function () {
      if (state.paused) resumeSpeech();
      else pauseSpeech();
    });
    els.stop.addEventListener('click', function () {
      stopSpeech();
      setStatus('Stopped');
    });

    els.autoRead.addEventListener('click', function () {
      state.prefs.autoReadChapter = !state.prefs.autoReadChapter;
      savePrefs();
      updateUI();
      setStatus(state.prefs.autoReadChapter
        ? 'Auto-read on — will read when a chapter enters view (Play once on iOS first).'
        : 'Auto-read off');
    });
    els.autoPlay.addEventListener('click', function () {
      if (reduceMotion) {
        setStatus('Auto-play disabled (reduced motion).');
        state.prefs.autoPlayChapters = false;
        savePrefs();
        updateUI();
        return;
      }
      state.prefs.autoPlayChapters = !state.prefs.autoPlayChapters;
      savePrefs();
      updateUI();
      setStatus(state.prefs.autoPlayChapters
        ? 'Auto-play chapters on — pauses if you scroll.'
        : 'Auto-play chapters off');
    });

    if (!synth) {
      setStatus('Speech synthesis not available in this browser.');
      els.play.disabled = true;
    }
  }

  function init() {
    buildUI();
    // Apply storytelling defaults for fresh installs (persona label)
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyPersona(state.prefs.persona || 'storyteller', false);
    }
    refreshVoices();
    if (synth) {
      synth.addEventListener('voiceschanged', refreshVoices);
      setTimeout(refreshVoices, 250);
      setTimeout(refreshVoices, 1000);
    }
    updateUI();
    if (state.prefs.enabled) setStatus('Narrator on — tap Play to read.');
  }

  var api = {
    getPrefs: function () { return Object.assign({}, state.prefs); },
    setPrefs: function (p) {
      state.prefs = Object.assign({}, state.prefs, p || {});
      savePrefs();
      updateUI();
    },
    play: playFromButton,
    stop: stopSpeech,
    pause: pauseSpeech,
    getMainText: getMainText,
    speakText: speakText,
    isEnabled: function () { return !!state.prefs.enabled; },
    isOpen: function () { return state.open; },
    /* test helpers */
    _toSpokenStyle: toSpokenStyle,
    _chunkForSpeech: chunkForSpeech,
    _voiceScore: voiceScore
  };

  global.HistoricNarrator = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : this);
