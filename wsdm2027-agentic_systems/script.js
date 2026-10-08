(function () {
  const biographyButtons = Array.from(document.querySelectorAll('.lineup-bio-toggle'));
  const biographyPanels = Array.from(document.querySelectorAll('.speaker-bio-panel'));
  function synchronizeBiographies() {
    biographyButtons.forEach(function (button) {
      const expanded = document.getElementById(button.getAttribute('aria-controls')).open;
      button.setAttribute('aria-expanded', String(expanded));
      button.innerHTML = expanded ? 'Close bio <span aria-hidden="true">−</span>' : 'Biography <span aria-hidden="true">+</span>';
    });
  }
  biographyButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      const shouldOpen = !panel.open;
      biographyPanels.forEach(function (other) { other.open = false; });
      panel.open = shouldOpen;
      synchronizeBiographies();
      if (shouldOpen) panel.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
  });
  biographyPanels.forEach(function (panel) {
    panel.addEventListener('toggle', synchronizeBiographies);
    panel.querySelector('summary').addEventListener('click', function (event) {
      if (!panel.open) return;
      event.preventDefault();
      panel.open = false;
      synchronizeBiographies();
      const trigger = biographyButtons.find(function (button) { return button.getAttribute('aria-controls') === panel.id; });
      if (trigger) trigger.focus();
    });
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
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const target = entry.target.id === 'speakers' ? 'speaker-lineup' : entry.target.id;
        if (!links.some(link => link.getAttribute('href') === '#' + target)) return;
        links.forEach(function (link) {
          if (link.getAttribute('href') === '#' + target) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, {rootMargin: '-75px 0px -65% 0px'});
    document.querySelectorAll('.section[id]').forEach(section => observer.observe(section));
  }
}());
