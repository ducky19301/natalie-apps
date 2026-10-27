# Historic — Living Histories (PWA)

Offline-friendly library of interactive films and scroll-histories.

## Local serve

    python3 -m http.server 8765 --directory /workspace/history-stories-app

## Monetization

Free tier: house/test ad placeholders. Historic+: mock sub removes ads + badge.
See docs/monetization.md.

## Narrator and motion

- Narrator (♪): voice, rate, pitch; speechSynthesis. Prefs: historic.narrator
- Story enhance: chapter entrance; optional Auto-advance. Prefs: historic.storyEnhance
  Respects prefers-reduced-motion.

## Scripts

- js/monetization.js
- js/narrator.js
- js/story-enhance.js
