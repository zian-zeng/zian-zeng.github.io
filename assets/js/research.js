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
  if (rows.length) filterPapers();
  if ('IntersectionObserver' in window) {
    const links = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        links.forEach(link => { if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
      }
    }, { rootMargin: '-15% 0px -65% 0px' });
    links.forEach(link => { const target = document.querySelector(link.hash); if (target) observer.observe(target); });
  }
})();
