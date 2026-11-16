(() => {
  'use strict';
  const menuButton = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('#mobile-menu');
  const setMenu = open => {
    if (!menuButton || !menu) return;
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  };
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') { setMenu(false); menuButton.focus(); }
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 780) setMenu(false); });
  const questions = {
    act: ['When should an agent act?', 'Tool-call admission and the structure of multi-agent collaboration.', 'Action & coordination'],
    recover: ['What makes recovery reliable?', 'Budget controls, goal feedback, and the behavior of stateful repair agents.', 'Agent recovery'],
    evaluate: ['What counts as real progress?', 'Separating agent capability from protocol effects and verifier inflation.', 'Evaluation validity']
  };
  const atlas = document.querySelector('[data-atlas]');
  const tabs = [...document.querySelectorAll('[role="tab"][data-phase]')];
  const selectPhase = phase => {
    if (!atlas || !questions[phase]) return;
    atlas.dataset.phase = phase;
    tabs.forEach(tab => { const selected = tab.dataset.phase === phase; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; });
    document.querySelector('[data-atlas-question]').textContent = questions[phase][0];
    document.querySelector('[data-atlas-detail]').textContent = questions[phase][1];
    document.querySelector('[data-atlas-kicker]').textContent = `${String(Object.keys(questions).indexOf(phase) + 1).padStart(2, '0')} / ${questions[phase][2]}`;
    document.querySelector('#atlas-panel').setAttribute('aria-labelledby', `tab-${phase}`);
    document.querySelector('[data-atlas-link]').dataset.topic = phase;
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectPhase(tab.dataset.phase));
    tab.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (e.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { e.preventDefault(); selectPhase(tabs[next].dataset.phase); tabs[next].focus(); }
    });
  });
  const rows = [...document.querySelectorAll('[data-paper]')];
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const search = document.querySelector('[data-paper-search]');
  let category = 'all'; let topic = null;
  const filterPapers = () => {
    const query = (search?.value || '').trim().toLocaleLowerCase();
    let count = 0;
    rows.forEach(row => {
      const match = (category === 'all' || (category === 'earlier' ? row.dataset.kind === 'publication' : row.dataset.topic === category)) && (!topic || row.dataset.topic === topic) && (!query || row.dataset.search.includes(query));
      row.hidden = !match; if (match) count++;
    });
    document.querySelectorAll('[data-group]').forEach(group => { group.hidden = ![...group.querySelectorAll('[data-paper]')].some(row => !row.hidden); });
    filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    document.querySelector('[data-results-status]').textContent = `${count} ${count === 1 ? 'paper' : 'papers'} shown`;
    document.querySelector('[data-no-results]').hidden = count !== 0;
    document.querySelector('[data-topic-banner]').hidden = !topic;
    if (topic) document.querySelector('[data-topic-label]').textContent = `Research question: ${questions[topic][2]}`;
  };
  document.querySelector('[data-filters]')?.removeAttribute('hidden');
  filterButtons.forEach(button => button.addEventListener('click', () => { category = button.dataset.filter; filterPapers(); }));
  search?.addEventListener('input', filterPapers);
  document.querySelector('[data-clear-topic]')?.addEventListener('click', () => { topic = null; filterPapers(); });
  document.querySelector('[data-atlas-link]')?.addEventListener('click', e => {
    e.preventDefault();
    topic = e.currentTarget.dataset.topic; category = 'all'; search.value = ''; filterPapers();
    const results = document.querySelector('#publication-results');
    history.replaceState(null, '', '#publication-results');
    results.focus({ preventScroll: true });
    results.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
  document.querySelectorAll('a[href="#publications"]:not([data-atlas-link])').forEach(link => link.addEventListener('click', () => { category = 'all'; topic = null; search.value = ''; filterPapers(); }));
  document.querySelectorAll('[data-paper-link]').forEach(link => link.addEventListener('click', () => { category = 'all'; topic = null; if (search) search.value = ''; filterPapers(); }));
  if (rows.length) filterPapers();
  if ('IntersectionObserver' in window) {
    const links = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
    /* >>> research-map band: the spy keeps every section that holds the reading line, and the last of them in page
       order is current. The hero and the band have no nav entry, so while either is that section no entry is
       current. Working from the whole set, not from the entry that just arrived, keeps a reload at a boundary right. */
    const reading = new Set();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) reading.add(entry.target); else reading.delete(entry.target);
      const at = [...reading].reduce((a, b) => (a && b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING ? a : b), null);
      if (at) links.forEach(link => { if (link.hash === `#${at.id}`) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
    }, { rootMargin: '-15% 0px -65% 0px' });
    links.forEach(link => { const target = document.querySelector(link.hash); if (target) observer.observe(target); });
    ['#top', '#research-map'].forEach(id => { const el = document.querySelector(id); if (el) observer.observe(el); });
    /* <<< research-map band */
  }
})();

// Research map visuals
(() => {
  'use strict';
  const root = document.querySelector('.rm-atlas[data-atlas]');
  if (!root) return;

  const $ = sel => root.querySelector(sel);
  const $$ = sel => Array.from(root.querySelectorAll(sel));
  const media = q => (window.matchMedia ? window.matchMedia(q) : { matches: false });
  const reduce = media('(prefers-reduced-motion: reduce)');
  const forced = media('(forced-colors: active)');
  const finePointer = media('(hover: hover) and (pointer: fine)');
  const details = root.closest('details');
  const summary = details ? details.querySelector('summary') : null;
  const frame = $('.rm-frame');
  const chart = $('[data-rm-chart]');
  const sky = $('[data-rm-sky]');
  const body = $('[data-rm-panel-body]');
  const fig = $('.rm-fig');
  const phases = ['act', 'recover', 'evaluate'];
  const isOpen = () => !details || details.open;
  let held = false;
  /* no one-off motion either under reduced motion, in forced colours or when the visitor paused the chart */
  const calm = () => reduce.matches || forced.matches || held;

  /* Selection belongs to research.js: diagram regions only forward to the real tabs. */
  const select = p => {
    const tab = document.getElementById('tab-' + p);
    if (tab && tab.getAttribute('aria-selected') !== 'true') tab.click();
  };
  const peek = p => {
    if (p && p !== root.dataset.phase) root.dataset.rmPreview = p;
    else delete root.dataset.rmPreview;
  };
  $$('[data-rm-select]').forEach(el => {
    const p = el.dataset.rmSelect;
    el.addEventListener('click', () => { select(p); peek(null); });
    el.addEventListener('pointerenter', () => peek(p));
    el.addEventListener('pointerleave', () => peek(null));
  });
  $$('.rm-tab[data-phase], .rm-paper[data-rm-phase]').forEach(el => {
    const p = el.dataset.phase || el.dataset.rmPhase;
    el.addEventListener('pointerenter', () => peek(p));
    el.addEventListener('pointerleave', () => peek(null));
  });
  root.addEventListener('click', e => {
    if (e.target && e.target.closest && e.target.closest('[role="tab"]')) peek(null);
  });

  /* The lens: hovering or focusing a paper link shows its topic, status and full title in the reserved slot and
     lights its star. The slot is persistent (WCAG 1.4.13): leaving the link keeps it, so the pointer can travel to
     the slot; it changes only after another paper has been hovered for 160ms, and clears when the pointer leaves
     the card or on Escape. */
  const stars = $$('.rm-paper[data-paper-link]');
  let hovered = null;
  let focused = null;
  let lastBy = 'hover';
  let dwell = 0;
  const refresh = () => {
    const quiet = root.hasAttribute('data-rm-quiet');
    const id = quiet ? null : lastBy === 'focus' ? focused || hovered : hovered || focused;
    if (id) root.dataset.rmShow = id;
    else delete root.dataset.rmShow;
    stars.forEach(s => s.classList.toggle('is-lit', !!id && s.dataset.paperLink === id));
  };
  const stopDwell = () => { clearTimeout(dwell); dwell = 0; };
  const hoverShow = id => { stopDwell(); hovered = id; lastBy = 'hover'; refresh(); };
  $$('[data-paper-link]').forEach(link => {
    const id = link.dataset.paperLink;
    link.addEventListener('pointerenter', e => {
      if (e.pointerType === 'touch') return;
      stopDwell();
      if (root.hasAttribute('data-rm-quiet') || !hovered) { root.removeAttribute('data-rm-quiet'); hoverShow(id); }
      else if (hovered !== id) dwell = setTimeout(() => hoverShow(id), 160);
    });
    link.addEventListener('pointerleave', stopDwell);
    link.addEventListener('focus', () => { root.removeAttribute('data-rm-quiet'); focused = id; lastBy = 'focus'; refresh(); });
    link.addEventListener('blur', () => { if (focused === id) focused = null; refresh(); });
  });
  if (frame) frame.addEventListener('pointerleave', () => { stopDwell(); if (hovered) { hovered = null; refresh(); } });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape' && e.key !== 'Esc') return;
    if (!root.dataset.rmShow) return;
    stopDwell();
    hovered = null;
    root.setAttribute('data-rm-quiet', '');
    refresh();
  });

  /* When the selection trace reaches a paper star, the star flashes once (one-shot Web Animation; --rm-reach comes
     from gen-markup.cjs, the same timing the CSS trace uses). */
  const flash = (p, base) => {
    if (calm() || !isOpen()) return;
    $$('.rm-paper--' + p).forEach(link => {
      const el = link.querySelector('.rm-paper__flash');
      if (!el || !el.animate) return;
      const reach = parseFloat(link.style.getPropertyValue('--rm-reach')) || 0;
      el.animate([
        { opacity: 0, transform: 'scale(.3)' },
        { opacity: 1, transform: 'scale(1)', offset: 0.26 },
        { opacity: 0, transform: 'scale(1.6)' }
      ], { duration: 780, delay: base + reach, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'backwards' });
    });
  };

  /* ...and its question on the rim catches the light: a soft spot runs once along the engraving in reading order
     (from the arc's start angle to its end angle), showing a bright copy of the text only beneath it. */
  const engraving = $('.rm-engraving');
  const shining = {};
  const shine = (p, delay) => {
    if (calm() || !isOpen() || !fig || !engraving || root.classList.contains('rm-eng-off')) return;
    if (getComputedStyle(engraving).display === 'none') return;
    const spot = fig.querySelector('#rm-shine-' + p + ' .rm-shine__spot');
    const copies = $$('.rm-shine.rm-engrave--' + p);
    if (!spot || !spot.animate || !copies.length) return;
    const a0 = parseFloat(spot.getAttribute('data-rm-from')) || 0;
    const a1 = parseFloat(spot.getAttribute('data-rm-to')) || 0;
    /* a newer run on the same question replaces an older one (whose cleanup then leaves the copies alone) */
    const prev = shining[p];
    shining[p] = null;
    if (prev) prev.cancel();
    let anim = null;
    const off = () => {
      if (anim && shining[p] !== anim) return;
      shining[p] = null;
      copies.forEach(t => t.classList.remove('is-on'));
      if (anim) anim.cancel();
    };
    try {
      copies.forEach(t => t.classList.add('is-on'));
      anim = spot.animate([{ transform: 'rotate(' + a0 + 'deg)' }, { transform: 'rotate(' + a1 + 'deg)' }],
        { duration: 1000, delay, easing: 'cubic-bezier(.45,.05,.35,1)', fill: 'both' });
      shining[p] = anim;
      anim.finished.then(off, off);
    } catch (err) {
      off();
    }
  };
  /* Pause stops the one-off motion that is already under way too (the shine, star flashes, panel crossfade) */
  const stillOneOffs = () => {
    Object.keys(shining).forEach(p => { const a = shining[p]; shining[p] = null; if (a) a.cancel(); });
    $$('.rm-shine.is-on').forEach(t => t.classList.remove('is-on'));
    [body].concat($$('.rm-paper__flash')).forEach(el => {
      if (el && el.getAnimations) el.getAnimations().forEach(a => a.cancel());
    });
  };

  /* Phones and other stacked maps: after a touch or pen tap on a name or a sky sector, scroll so the new kicker,
     question, detail and first paper row are in view (the row's bottom about 16px above the fold), but never so far
     that the tapped name goes under the sticky site header. Mouse clicks never scroll. Smooth, or instant under
     reduced motion. research.js's nodes are only measured. */
  let tapAt = -1e9;
  root.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' && e.target && e.target.closest && e.target.closest('.rm-tab, .rm-hit')) tapAt = performance.now();
  }, true);
  const headerBottom = () => {
    const h = document.querySelector('.site-header') || document.querySelector('body > header');
    if (!h) return 0;
    const pos = getComputedStyle(h).position;
    return pos === 'sticky' || pos === 'fixed' ? Math.max(0, h.getBoundingClientRect().bottom) : 0;
  };
  const reveal = p => {
    const vh = window.innerHeight;
    /* landscape phones leave only about 300px under the sticky header, at any map width */
    const short = vh < 500;
    if (root.getBoundingClientRect().width >= 720 && !short) return;
    const row = root.querySelector('.rm-rows__group--' + p + ' li');
    const target = row || root.querySelector('[data-atlas-detail]');
    const tab = document.getElementById('tab-' + p);
    if (!target || !tab) return;
    const behavior = reduce.matches ? 'instant' : 'smooth';
    if (short) {
      /* Show the panel block (kicker to first row) together with the tapped name when both fit; when they cannot,
         the panel wins: its kicker goes 8px under the header, which may scroll the tapped name away. */
      const kicker = root.querySelector('[data-atlas-kicker]');
      const pTop = (kicker || target).getBoundingClientRect().top;
      const pBot = target.getBoundingClientRect().bottom;
      const lo = headerBottom() + 8;
      const hi = vh - 16;
      if (pTop >= lo - 1 && pBot <= hi + 1) return;
      const t = tab.getBoundingClientRect();
      const uTop = Math.min(pTop, t.top);
      const uBot = Math.max(pBot, t.bottom);
      const by = Math.round(uBot - uTop <= hi - lo ? (uBot > hi ? uBot - hi : uTop < lo ? uTop - lo : 0) : pTop - lo);
      if (Math.abs(by) > 1) window.scrollBy({ top: by, left: 0, behavior });
      return;
    }
    const need = target.getBoundingClientRect().bottom - (vh - 16);
    if (need <= 1) return;
    const room = tab.getBoundingClientRect().top - headerBottom() - 10;
    const by = Math.round(Math.min(need, room));
    if (by > 1) window.scrollBy({ top: by, left: 0, behavior });
  };

  /* Panel: research.js rewrites kicker, question and detail; rows and key follow [data-phase] in CSS (the invisible
     sizers reserve the tallest panel, so the map keeps its height). Here the panel body crossfades, the new pair
     flashes and its question on the rim catches the light. */
  let phase = root.dataset.phase;
  if ('MutationObserver' in window) {
    new MutationObserver(() => {
      const next = root.dataset.phase;
      if (next === phase || phases.indexOf(next) < 0) return;
      phase = next;
      if (performance.now() - tapAt < 1500) { tapAt = -1e9; reveal(next); }
      /* the same rule as every other one-off motion: none under reduced motion, in forced colours or while paused */
      if (body && body.animate && !calm()) {
        body.animate(
          [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
          { duration: 460, easing: 'cubic-bezier(.2,.75,.25,1)' }
        );
      }
      flash(next, 0);
      shine(next, 120);
    }).observe(root, { attributes: true, attributeFilter: ['data-phase'] });
  }

  /* The episode ring passes through the three names. Its arcs are measured from the names' real boxes, so the
     gaps fit whatever font and tier is in use (static fallback arcs ship in the markup). The two side arcs are split
     at their midpoint for a direction chevron; the markers keep one screen size on every sky. */
  const ringPaths = $$('[data-rm-ring-arcs] .rm-ring__arc');
  const reveals = $$('.rm-ring__reveal');
  const marks = $$('.rm-mark');
  const tabs = $$('.rm-tab[data-rm-angle]');
  const R = fig ? parseFloat(fig.getAttribute('data-rm-ring')) || 412 : 412;
  const rad = d => (d * Math.PI) / 180;
  const deg = r => (r * 180) / Math.PI;
  const pt = (a, r) => [500 + r * Math.sin(rad(a)), 500 - r * Math.cos(rad(a))];
  const r1 = n => Math.round(n * 10) / 10;
  const P = a => { const [x, y] = pt(a, R); return r1(x) + ' ' + r1(y); };
  const ringArc = (a0, a1, mid) => {
    if (!mid) return 'M' + P(a0) + 'A' + R + ' ' + R + ' 0 ' + (a1 - a0 > 180 ? 1 : 0) + ' 1 ' + P(a1);
    const am = (a0 + a1) / 2;
    return 'M' + P(a0) + 'A' + R + ' ' + R + ' 0 0 1 ' + P(am) + 'A' + R + ' ' + R + ' 0 0 1 ' + P(a1);
  };
  /* "evidence informs the next action" rides the top arc when it fits there at 13px or more; otherwise the
     straight note under the sky carries it. Its path sits far enough outside the ring that the words keep 4px from
     the arc's arrowhead, whose size is fixed in screen pixels (so it is relatively larger on a smaller sky). */
  const caption = $('.rm-ring__caption');
  const capPath = fig ? fig.querySelector('#rm-caption-path') : null;
  const capAttr = (n, d) => (capPath && parseFloat(capPath.getAttribute(n))) || d;
  const capR0 = capAttr('data-rm-r', 433);
  const placeCaption = (k, markPx) => {
    if (!capPath) return;
    const half = (markPx * 6.4) / 20;             /* the arrowhead's half-width in px (6.4 of 20 marker units) */
    const r = r1(Math.min(capR0 + 12, Math.max(capR0, R + (half + 4) * k + 1.5)));
    const a0 = capAttr('data-rm-from', 323), a1 = capAttr('data-rm-to', 37);
    const [x0, y0] = pt(a0, r), [x1, y1] = pt(a1, r);
    capPath.setAttribute('d', 'M' + r1(x0) + ' ' + r1(y0) + 'A' + r + ' ' + r + ' 0 0 1 ' + r1(x1) + ' ' + r1(y1));
  };
  const fitCaption = unitPx => {
    if (!caption || !capPath || !caption.getComputedTextLength || !capPath.getTotalLength) return;
    const room = capPath.getTotalLength() * 0.97;
    let fits = false;
    root.classList.remove('rm-cap-line');
    root.classList.add('rm-cap-curve');
    for (const px of [14, 13.5, 13.1]) {
      root.style.setProperty('--rm-cap', (px / unitPx).toFixed(2) + 'px');
      if (caption.getComputedTextLength() <= room) { fits = true; break; }
    }
    root.classList.toggle('rm-cap-curve', fits);
    root.classList.toggle('rm-cap-line', !fits);
  };
  /* The rim engraves each sector's question at 13.5px, then 13px with ever tighter tracking (.04em down to 0). Where
     any question still outgrows its arc (smaller skies, other fonts, user text spacing) all three fall back to the
     shorter kickers; if even those do not fit, the engraving steps aside. */
  const ENG_STEPS = [[13.5, 0.04], [13, 0.04], [13, 0.02], [13, 0]];
  const engQ = $$('.rm-engrave--q:not(.rm-shine)');
  const engK = $$('.rm-engrave--k:not(.rm-shine)');
  const fitsArc = t => {
    const tp = t.querySelector('textPath');
    const p = tp && fig.querySelector(tp.getAttribute('href'));
    if (!p || !t.getComputedTextLength || !p.getTotalLength) return true;
    return t.getComputedTextLength() <= p.getTotalLength() * 0.97;
  };
  const fitEngraving = unitPx => {
    if (!fig || !engQ.length) return;
    root.classList.remove('rm-eng-off', 'rm-eng-k');
    root.classList.add('rm-eng-q');
    for (const [px, ls] of ENG_STEPS) {
      root.style.setProperty('--rm-eng', (px / unitPx).toFixed(2) + 'px');
      root.style.setProperty('--rm-eng-ls', ls + 'em');
      if (engQ.every(fitsArc)) return;
    }
    root.style.setProperty('--rm-eng', (13.5 / unitPx).toFixed(2) + 'px');
    root.style.removeProperty('--rm-eng-ls');
    root.classList.replace('rm-eng-q', 'rm-eng-k');
    if (!engK.every(fitsArc)) root.classList.add('rm-eng-off');
  };
  const layoutRing = () => {
    if (!sky || !isOpen() || tabs.length !== 3 || !ringPaths.length) return;
    let box = sky.getBoundingClientRect();
    if (!box.width) return;
    /* markers: 20 marker units = markPx on screen, so arrowheads (16 units) are 12-15px long on every sky (the sky's
       size follows the container only, so it is the same before and after the caption mode is chosen) */
    const markPx = Math.max(15, Math.min(19, box.width * 0.0365));
    placeCaption(1000 / box.width, markPx);
    fitCaption(box.width / 1000);
    fitEngraving(box.width / 1000);
    /* the caption mode decides whether the straight note shows, which can move the sky inside its column */
    box = sky.getBoundingClientRect();
    const unitPx = box.width / 1000;
    const k = 1 / unitPx;
    marks.forEach(m => { const u = r1(markPx * k); m.setAttribute('markerWidth', u); m.setAttribute('markerHeight', u); });
    const degPx = px => deg((px * k) / R);
    const pad = 8 * k;
    const gaps = {};
    tabs.forEach(tab => {
      const a0 = parseFloat(tab.dataset.rmAngle);
      let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
      tab.querySelectorAll('.rm-tab__num, .rm-tab__name').forEach(el => {
        const rc = el.getBoundingClientRect();
        l = Math.min(l, rc.left); t = Math.min(t, rc.top); r = Math.max(r, rc.right); b = Math.max(b, rc.bottom);
      });
      if (!(r > l)) return;
      const x0 = (l - box.left) * k - pad, x1 = (r - box.left) * k + pad;
      const y0 = (t - box.top) * k - pad, y1 = (b - box.top) * k + pad * 1.6;
      const hit = a => { const [x, y] = pt(a, R); return x > x0 && x < x1 && y > y0 && y < y1; };
      let best = null;
      for (let a = a0 - 80; a <= a0 + 80; a += 0.5) {
        if (!hit(a)) continue;
        let lo = a;
        while (a + 0.5 <= a0 + 80 && hit(a + 0.5)) a += 0.5;
        const run = [lo, a];
        const dist = a0 < lo ? lo - a0 : a0 > a ? a0 - a : 0;
        if (!best || dist < best.dist) best = { run, dist };
      }
      gaps[tab.dataset.phase] = best && best.dist < 20 ? best.run : [a0 - 3, a0 + 3];
    });
    ringPaths.forEach(path => {
      const from = gaps[path.dataset.rmFrom], to = gaps[path.dataset.rmTo];
      if (!from || !to) return;
      /* leave room for the start bar (at 01, 2.6 of 20 marker units thick) and the arrowhead's tip before the next name */
      const a0 = from[1] + degPx(path.hasAttribute('marker-start') ? markPx * 0.1 + 3 : 3);
      let a1 = to[0] - degPx(markPx * 0.35 + 4);
      while (a1 <= a0 + 10) a1 += 360;
      const d = ringArc(a0, a1, path.hasAttribute('data-rm-mid'));
      path.setAttribute('d', d);
      reveals.forEach(m => { if (m.dataset.rmTo === path.dataset.rmTo) m.setAttribute('d', d); });
    });
  };

  /* In-sky labels must never touch (WCAG 1.4.12: with user text spacing, or fallback fonts, they grow). After
     fonts.ready, on resize, on a label's size change and when a stylesheet is added, the label boxes are intersected
     with the names in the sky shown; on any overlap the sky switches to key mode (.rm-keyed: a label-free sky, the
     names as chips in the panel). Measured synchronously, so no frame shows the colliding state. */
  const skyLabels = $$('.rm-paper__label, .rm-tab__num, .rm-tab__name, .rm-pole__name, .rm-pole__tag');
  const textRects = el => {
    const rng = document.createRange();
    rng.selectNodeContents(el);
    return Array.from(rng.getClientRects()).filter(b => b.width > 0.5 && b.height > 0.5);
  };
  /* Two labels side by side must keep more than a word space between them (8px), or they read as one phrase;
     stacked labels must not touch (2px). A name's own lines (a tab's number and name, the pole star's name and
     subtitle) are one label. At normal spacing the tightest pairs keep 16px and 5px, so only grown text trips it. */
  const tooClose = (ra, rb) => {
    const dx = Math.max(ra.left, rb.left) - Math.min(ra.right, rb.right);
    const dy = Math.max(ra.top, rb.top) - Math.min(ra.bottom, rb.bottom);
    if (dy < 0 && dx < 0) return true;
    return dy < 0 ? dx < 8 : dx < 0 ? dy < 2 : false;
  };
  const checkLabels = () => {
    if (!sky || !isOpen()) return;
    root.classList.remove('rm-keyed');
    const shown = skyLabels.filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');
    const boxes = shown.map(el => ({ el, group: el.closest('.rm-tab, .rm-pole__label'), rects: textRects(el) }));
    let hit = false;
    for (let i = 0; i < boxes.length && !hit; i++) {
      for (let j = i + 1; j < boxes.length && !hit; j++) {
        const a = boxes[i], b = boxes[j];
        if (a.el.contains(b.el) || b.el.contains(a.el) || (a.group && a.group === b.group)) continue;
        hit = a.rects.some(ra => b.rects.some(rb => tooClose(ra, rb)));
      }
    }
    root.classList.toggle('rm-keyed', hit);
  };
  const refit = () => { layoutRing(); checkLabels(); };
  if ('ResizeObserver' in window) {
    /* the sky, not the root: refit() can change the root's own height (rim text, key mode), which would re-trigger
       an observer on the root in the same frame ("ResizeObserver loop completed with undelivered notifications") */
    new ResizeObserver(() => refit()).observe(sky || root);
    const ro = new ResizeObserver(entries => {
      if (entries.some(en => en.contentRect.width > 0 && en.contentRect.height > 0)) refit();
    });
    skyLabels.forEach(el => ro.observe(el));
  } else {
    window.addEventListener('resize', refit, { passive: true });
  }
  if ('MutationObserver' in window && document.head) {
    let pending = 0;
    new MutationObserver(() => { clearTimeout(pending); pending = setTimeout(refit, 60); }).observe(document.head, { childList: true });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refit, () => {});
  refit();

  /* Gentle parallax on a fine pointer: only the two star-field layers drift; labels and targets stay put. */
  const layers = $$('[data-rm-depth]');
  let frameId = 0;
  let px = 0;
  let py = 0;
  let cached = null;
  const apply = () => {
    frameId = 0;
    layers.forEach(layer => {
      const depth = parseFloat(layer.dataset.rmDepth) || 0;
      layer.style.translate = (-px * depth).toFixed(2) + 'px ' + (-py * depth).toFixed(2) + 'px';
    });
  };
  const queue = () => { if (!frameId) frameId = requestAnimationFrame(apply); };
  const clamp = v => Math.max(-1, Math.min(1, v));
  if (chart && layers.length) {
    chart.addEventListener('pointermove', e => {
      if (reduce.matches || !finePointer.matches || e.pointerType === 'touch' || root.classList.contains('rm-paused')) return;
      if (!cached) cached = chart.getBoundingClientRect();
      px = clamp(((e.clientX - cached.left) / cached.width - 0.5) * 2);
      py = clamp(((e.clientY - cached.top) / cached.height - 0.5) * 2);
      queue();
    }, { passive: true });
    chart.addEventListener('pointerleave', () => { cached = null; if (px || py) { px = 0; py = 0; queue(); } });
    const forget = () => { cached = null; };
    window.addEventListener('scroll', forget, { passive: true });
    window.addEventListener('resize', forget, { passive: true });
  }

  /* Idle motion runs only while the map is open, on screen, the page visible and not paused by the visitor. */
  let visible = !('IntersectionObserver' in window);
  const sync = () => root.classList.toggle('rm-paused', held || !(visible && isOpen() && !document.hidden));
  const pause = $('[data-rm-pause]');
  if (pause) {
    /* Idle motion starts only once its pause control exists, so a page without JS stays still. */
    root.classList.add('rm-live');
    pause.hidden = false;
    pause.addEventListener('click', () => {
      held = !held;
      root.classList.toggle('rm-hold', held);
      pause.setAttribute('aria-label', held ? 'Play animation' : 'Pause animation');
      if (held) { clearEntrance(); stillOneOffs(); }
      sync();
    });
  }
  if (!visible) {
    new IntersectionObserver(entries => {
      visible = entries[entries.length - 1].isIntersecting;
      sync();
    }, { threshold: 0.02 }).observe(root);
  }

  /* Opening the map: the episode ring draws itself 01 -> 02 -> 03 and back (a mask over the dashed arcs), the
     selected constellation traces in, its stars flash as the line arrives, and the comet sets off from Act once the
     loop has closed. The start state is set by the visitor's own click on the summary, before the details opens,
     so the first painted frame is already the empty ring; the timeline itself starts on the toggle event. Skipped
     when the map opens out of view, paused, under reduced motion or in forced colours; fail-safe, so the chart can
     never stay masked. */
  const arcsGroup = $('[data-rm-ring-arcs]');
  const EASE = 'cubic-bezier(.45,0,.3,1)';
  let entrance = null;
  const clearEntrance = () => {
    const e = entrance;
    if (!e) return;
    entrance = null;
    clearTimeout(e.timer);
    e.anims.forEach(a => { try { a.cancel(); } catch (err) { /* already gone */ } });
    if (arcsGroup) arcsGroup.removeAttribute('mask');
    root.classList.remove('rm-intro');
  };
  const prepareEntrance = () => {
    const e = { anims: [], timer: 0, started: false };
    entrance = e;
    root.classList.add('rm-intro');
    arcsGroup.setAttribute('mask', 'url(#rm-ring-reveal)');
    ['recover', 'evaluate', 'act'].forEach((to, i) => {
      const m = reveals.find(r => r.dataset.rmTo === to);
      if (!m) return;
      const a = m.animate([{ strokeDashoffset: 1.05 }, { strokeDashoffset: 0 }], {
        duration: 560, delay: 140 + i * 360, easing: EASE, fill: 'backwards'
      });
      a.pause();
      e.anims.push(a);
    });
    $$('.rm-c--' + root.dataset.phase + ' .rm-trace path').forEach((path, i) => {
      const a = path.animate([{ strokeDashoffset: '1' }, { strokeDashoffset: '0' }], {
        duration: 500, delay: 300 + i * 70, easing: 'cubic-bezier(.55,0,.25,1)', fill: 'backwards'
      });
      a.pause();
      e.anims.push(a);
    });
    /* if the details never opens (a cancelled click), drop the start state */
    e.timer = setTimeout(() => { if (entrance === e && !e.started) clearEntrance(); }, 900);
  };
  /* The timeline starts two frames after the toggle, once the opened map has painted its start state, so a slow first
     paint (a cold browser) delays the draw instead of eating its beginning. If no frame comes in time (for example a
     background tab) or anything throws, the static chart is shown; errors never escape to the page. */
  const playEntrance = e => {
    if (entrance !== e || e.playing) return;
    e.playing = true;
    clearTimeout(e.timer);
    try {
      if (calm() || !isOpen() || document.hidden) { clearEntrance(); return; }
      e.anims.forEach(a => a.play());
      flash(root.dataset.phase, 240);
      shine(root.dataset.phase, 420);
      const last = e.anims[2];
      const done = () => { if (entrance === e) clearEntrance(); };
      if (last && last.finished) last.finished.then(done, () => {});
      e.timer = setTimeout(done, 2600);
    } catch (err) {
      clearEntrance();
    }
  };
  const startEntrance = () => {
    const e = entrance;
    if (!e || e.started) return;
    e.started = true;
    clearTimeout(e.timer);
    let ok = false;
    try {
      if (calm() || !isOpen() || document.hidden) return;
      requestAnimationFrame(() => requestAnimationFrame(() => playEntrance(e)));
      e.timer = setTimeout(() => { if (entrance === e && !e.playing) clearEntrance(); }, 1500);
      ok = true;
    } catch (err) {
      /* fall through: the static chart is shown */
    } finally {
      if (!ok) clearEntrance();
    }
  };
  const opensInView = () => {
    const r = summary ? summary.getBoundingClientRect() : root.getBoundingClientRect();
    return r.bottom > -200 && r.bottom < window.innerHeight - 100;
  };
  const canEnter = () => !calm() && !document.hidden && !!arcsGroup && reveals.length === 3 && !!reveals[0].animate;
  if (summary) {
    summary.addEventListener('click', () => {
      if (details.open || entrance) return;
      try {
        if (canEnter() && opensInView()) prepareEntrance();
      } catch (err) {
        clearEntrance();
      }
    }, true);
  }
  if (details) {
    details.addEventListener('toggle', () => {
      try {
        if (details.open) {
          refit();
          if (entrance) startEntrance();
        } else {
          clearEntrance();
        }
      } catch (err) {
        clearEntrance();
      } finally {
        sync();
      }
    });
  }
  document.addEventListener('visibilitychange', sync);
  if (reduce.addEventListener) {
    reduce.addEventListener('change', () => { if (reduce.matches) { clearEntrance(); stillOneOffs(); px = 0; py = 0; queue(); } });
  }
  sync();
  /* A chart without <details> (the site's research-map band, .rm-atlas--band) is always open. Its entrance start
     state (the empty ring, the untraced figure, the comet waiting) is set now, while the chart is still below the
     fold, and the draw plays the first time at least 55% of the sky is in view under the sticky header. A chart that
     is already on screen when this runs stays static (its finished frame may have been painted), and so does every
     chart under reduced motion, in forced colours or paused. So does a chart whose window cannot show 60% of the sky
     under the header (a phone on its side, a laptop at 200% zoom): it could never be mostly in view. Touching,
     clicking, focusing or typing in the chart before the draw starts, printing the page, or a resize that leaves too
     little room for the sky drops the start state. Nothing is observed or listened to after that. A chart inside
     <details> keeps its own path (the else branch), unchanged. */
  if (!details) {
    const skyEl = sky || root;
    const room = () => window.innerHeight - headerBottom();
    const onScreen = () => {
      const r = skyEl.getBoundingClientRect();
      return r.width > 0 && r.bottom > headerBottom() && r.top < window.innerHeight;
    };
    const roomy = () => {
      const h = skyEl.getBoundingClientRect().height;
      return h > 0 && room() >= 0.6 * h;
    };
    if (canEnter() && 'IntersectionObserver' in window && !onScreen() && roomy()) {
      let io = null;
      let e = null;
      const kinds = ['pointerdown', 'keydown', 'focusin'];
      const stop = () => {
        if (io) { io.disconnect(); io = null; }
        kinds.forEach(type => root.removeEventListener(type, drop, true));
        window.removeEventListener('beforeprint', drop);
        window.removeEventListener('resize', shrink);
      };
      function drop() {
        stop();
        if (e && entrance === e && !e.started) clearEntrance();
      }
      function shrink() {
        if (!roomy()) drop();
      }
      /* The share of the sky that starts the draw: 55%, or, should the window hold less than 0.55/0.9 of the sky,
         the largest 5% step under 90% of what it holds. It is one of the observer's thresholds, so it is always
         reachable and always reported. */
      const steps = Array.from({ length: 12 }, (_, i) => i / 20);
      const need = () => {
        const h = skyEl.getBoundingClientRect().height;
        const reach = h > 0 ? Math.min(1, room() / h) : 0;
        return Math.max(1, Math.min(11, Math.floor(reach * 0.9 * 20))) / 20;
      };
      try {
        prepareEntrance();
        e = entrance;
        /* the start state waits for the scroll, not for a toggle (prepareEntrance's 900ms guard is for a summary click) */
        clearTimeout(e.timer);
        e.timer = 0;
        io = new IntersectionObserver(entries => {
          const en = entries[entries.length - 1];
          if (entrance !== e || e.started) { drop(); return; }
          if (en.isIntersecting && en.intersectionRatio >= need()) { stop(); startEntrance(); }
        }, { threshold: steps, rootMargin: '-' + Math.round(headerBottom()) + 'px 0px 0px 0px' });
        io.observe(skyEl);
        kinds.forEach(type => root.addEventListener(type, drop, true));
        window.addEventListener('beforeprint', drop);
        window.addEventListener('resize', shrink, { passive: true });
      } catch (err) {
        stop();
        clearEntrance();
      }
    }
  } else if (isOpen() && canEnter()) {
    /* a map that is already open when the page loads (the prototypes) plays the entrance only if it is in view */
    const r = root.getBoundingClientRect();
    if (r.top < window.innerHeight - 100 && r.bottom > 100) {
      try { prepareEntrance(); startEntrance(); } catch (err) { clearEntrance(); }
    }
  }
})();

// Research map band
(() => {
  'use strict';
  /* Arrival. The hero's "Explore my research", the topic banner's "Back to the chart" and any other #research-map
     link or address bring the visitor to the band; focus then moves to the band's heading (h2#map-title,
     tabindex="-1"), so keyboard and screen-reader users start in front of the chart, where the page now shows them.
     The browser's own scroll is kept (preventScroll), and a pointer arrival shows no ring (band.css, :focus-visible).
     The heading sits outside the chart, so the chart's entrance still plays on arrival. Focus that is already inside
     the band is left where it is. A page opened at #research-map has had no input yet, so the browser would draw the
     ring there too; that arrival is marked quiet and shows none. On short windows the arrival lands on the chart and
     the heading is out of view (band.css sets --map-arrive: chart there); a keyboard arrival, the one that shows a
     ring, then moves on to the chart's selected tab, so the ring is never hidden under the header. A pointer arrival
     keeps the heading, which shows no ring and leaves the chart's entrance to play. */
  const band = document.getElementById('research-map');
  const title = document.getElementById('map-title');
  if (!band || !title) return;
  const keyed = () => {
    try { return title.matches(':focus-visible'); } catch (err) { return false; }
  };
  const land = quiet => {
    const active = document.activeElement;
    if (active && active !== title && band.contains(active)) return;
    if (quiet === true) title.setAttribute('data-map-quiet', '');
    try { title.focus({ preventScroll: true }); } catch (err) { return; }
    if (quiet === true || getComputedStyle(band).getPropertyValue('--map-arrive').trim() !== 'chart' || !keyed()) return;
    const tab = band.querySelector('[role="tab"][aria-selected="true"]');
    if (tab) try { tab.focus({ preventScroll: true }); } catch (err) { /* the heading keeps focus */ }
  };
  title.addEventListener('blur', () => title.removeAttribute('data-map-quiet'));
  document.addEventListener('click', e => {
    const link = e.target && e.target.closest ? e.target.closest('a[href="#research-map"]') : null;
    if (!link || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    /* after the browser's own fragment navigation, which follows this click's dispatch */
    setTimeout(land, 0);
  });
  window.addEventListener('hashchange', () => { if (location.hash === '#research-map') land(); });
  /* a reload or a history step restores the visitor's own scroll position instead; focus stays where the browser puts it */
  const nav = performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null;
  if (location.hash === '#research-map' && !(nav && nav.type && nav.type !== 'navigate')) {
    const onLoad = () => setTimeout(() => {
      const active = document.activeElement;
      if (location.hash === '#research-map' && (!active || active === document.body)) land(true);
    }, 0);
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });
  }
})();
