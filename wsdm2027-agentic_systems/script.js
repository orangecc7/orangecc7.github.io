(function () {
  const biographyButtons = Array.from(document.querySelectorAll('.lineup-bio-toggle'));
  const biographyPanels = Array.from(document.querySelectorAll('.speaker-bio-panel'));
  const biographyHome = document.querySelector('.speaker-biographies');
  const lineup = document.querySelector('.speaker-lineup');
  const lineupCards = Array.from(lineup.querySelectorAll('.lineup-person'));
  const compactLineup = window.matchMedia('(max-width: 1100px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const inlineBiography = document.createElement('li');
  inlineBiography.className = 'lineup-inline-biography';

  function synchronizeBiographies() {
    biographyButtons.forEach(function (button) {
      const expanded = document.getElementById(button.getAttribute('aria-controls')).open;
      button.setAttribute('aria-expanded', String(expanded));
      button.closest('.lineup-person').classList.toggle('has-open-bio', expanded);
      button.innerHTML = expanded ? 'Close bio <span aria-hidden="true">−</span>' : 'Biography <span aria-hidden="true">+</span>';
    });
  }
  function placeBiography(panel, button) {
    biographyPanels.forEach(function (other) { biographyHome.appendChild(other); });
    inlineBiography.remove();
    if (!panel || !compactLineup.matches) return;
    const columns = getComputedStyle(lineup).gridTemplateColumns.split(' ').length;
    const index = lineupCards.indexOf(button.closest('.lineup-person'));
    const rowEnd = Math.min(lineupCards.length - 1, Math.floor(index / columns) * columns + columns - 1);
    lineupCards[rowEnd].after(inlineBiography);
    inlineBiography.appendChild(panel);
  }
  function revealBiography(panel) {
    requestAnimationFrame(function () {
      if (!panel.open || !compactLineup.matches) return;
      const top = panel.getBoundingClientRect().top;
      const navHeight = document.querySelector('.site-nav').getBoundingClientRect().height;
      // Keep context when already visible; bring the biography into view otherwise.
      if (top > window.innerHeight - 160 || top < navHeight) {
        panel.scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      }
    });
  }
  biographyButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      const shouldOpen = !panel.open;
      biographyPanels.forEach(function (other) { other.open = false; });
      placeBiography(shouldOpen ? panel : null, button);
      panel.open = shouldOpen;
      synchronizeBiographies();
      if (shouldOpen) revealBiography(panel);
    });
  });
  biographyPanels.forEach(function (panel) {
    panel.addEventListener('toggle', synchronizeBiographies);
    panel.querySelector('summary').addEventListener('click', function (event) {
      if (!panel.open) return;
      event.preventDefault();
      panel.open = false;
      const trigger = biographyButtons.find(function (button) { return button.getAttribute('aria-controls') === panel.id; });
      placeBiography(null, trigger);
      synchronizeBiographies();
      if (trigger) {
        trigger.focus({ preventScroll: true });
        if (compactLineup.matches && trigger.getBoundingClientRect().top < 76) trigger.scrollIntoView({ block: 'center', behavior: 'auto' });
      }
    });
  });
  // Reposition an open biography when rotating a phone or resizing a window.
  window.addEventListener('resize', function () {
    const panel = biographyPanels.find(function (item) { return item.open; });
    const trigger = panel && biographyButtons.find(function (button) { return button.getAttribute('aria-controls') === panel.id; });
    placeBiography(panel, trigger);
  });
  document.body.classList.add('people-ready');
  const overviewButton = document.querySelector('.overview-expand');
  if (overviewButton) overviewButton.addEventListener('click', function () {
    const expanded = overviewButton.getAttribute('aria-expanded') !== 'true';
    overviewButton.setAttribute('aria-expanded', String(expanded));
    overviewButton.closest('.overview-copy').classList.toggle('is-expanded', expanded);
    overviewButton.innerHTML = expanded ? 'Close overview <span aria-hidden="true">−</span>' : 'Read overview <span aria-hidden="true">+</span>';
  });
  const button = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-links');
  const links = Array.from(menu.querySelectorAll('a[href^="#"]'));
  function closeMenu() {
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Open navigation');
    menu.dataset.open = 'false';
  }
  button.addEventListener('click', function () {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menu.dataset.open = String(open);
  });
  links.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      closeMenu(); button.focus();
    }
  });
  const sections = links.map(function (link) { return document.querySelector(link.getAttribute('href')); }).filter(Boolean);
  let updatePending = false;
  function updateCurrentSection() {
    updatePending = false;
    const marker = document.querySelector('.site-nav').getBoundingClientRect().height + 100;
    let active = sections[0];
    sections.forEach(function (section) { if (section.getBoundingClientRect().top <= marker) active = section; });
    links.forEach(function (link) {
      if (active && link.getAttribute('href') === '#' + active.id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleNavigationUpdate() {
    if (updatePending) return;
    updatePending = true;
    requestAnimationFrame(updateCurrentSection);
  }
  window.addEventListener('scroll', scheduleNavigationUpdate, { passive: true });
  window.addEventListener('resize', scheduleNavigationUpdate);
  updateCurrentSection();
}());
