(function () {
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
