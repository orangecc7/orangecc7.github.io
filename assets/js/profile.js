(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const syncThemeButton = () => {
    const isDark = root.dataset.theme === 'dark';
    toggle?.setAttribute('aria-pressed', String(isDark));
    toggle?.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
  };
  syncThemeButton();
  toggle?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('orange-theme', root.dataset.theme); } catch (error) { /* Theme works without storage. */ }
    syncThemeButton();
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    try { if (localStorage.getItem('orange-theme')) return; } catch (error) { /* Follow the system preference. */ }
    root.dataset.theme = event.matches ? 'dark' : 'light';
    syncThemeButton();
  });

  const contactToast = document.querySelector('.contact-toast');
  let contactNoticeVersion = 0;
  let dismissContactTimer;
  let clearContactTimer;
  let activeContact;
  const dismissContactToast = () => {
    contactNoticeVersion += 1;
    clearTimeout(dismissContactTimer);
    clearTimeout(clearContactTimer);
    contactToast?.classList.remove('is-visible');
    contactToast?.classList.add('is-leaving');
    clearContactTimer = setTimeout(() => {
      contactToast?.replaceChildren();
      contactToast?.classList.remove('is-manual', 'is-leaving');
      activeContact = null;
    }, 200);
  };
  const positionContactToast = () => {
    if (!contactToast || !activeContact) return;
    const anchor = activeContact.getBoundingClientRect();
    const bubble = contactToast.getBoundingClientRect();
    // One closed outline joins the pointer and rounded body without overlapping borders.
    const width = bubble.width + 6;
    const height = bubble.height;
    const radius = (height - 1) / 2;
    const centerY = height / 2;
    const leftCenter = 6.5 + radius;
    const right = width - 0.5;
    const rightCenter = right - radius;
    const joinY = Math.min(3.5, radius / 2);
    const joinX = leftCenter - Math.sqrt(radius * radius - joinY * joinY);
    const outline = `M ${leftCenter} 0.5 H ${rightCenter}
      A ${radius} ${radius} 0 0 1 ${right} ${centerY}
      A ${radius} ${radius} 0 0 1 ${rightCenter} ${height - 0.5}
      H ${leftCenter} A ${radius} ${radius} 0 0 1 ${joinX} ${centerY + joinY}
      L 0.5 ${centerY} L ${joinX} ${centerY - joinY}
      A ${radius} ${radius} 0 0 1 ${leftCenter} 0.5 Z`;
    const color = getComputedStyle(contactToast).color;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><path d="${outline}" fill="white" stroke="${color}" stroke-width="1" stroke-linejoin="round"/></svg>`;
    contactToast.style.setProperty('--contact-toast-shape', `url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
    const left = Math.max(12, Math.min(anchor.right + 10, window.innerWidth - bubble.width - 12));
    const top = Math.max(12, Math.min(anchor.top + (anchor.height - bubble.height) / 2, window.innerHeight - bubble.height - 12));
    contactToast.style.left = `${left}px`;
    contactToast.style.top = `${top}px`;
  };
  document.querySelectorAll('[data-copy-contact]').forEach((link) => {
    link.addEventListener('click', async (event) => {
      event.preventDefault();
      const version = ++contactNoticeVersion;
      clearTimeout(dismissContactTimer);
      clearTimeout(clearContactTimer);
      const label = link.dataset.copyLabel || 'Contact';
      let copied = false;
      try {
        await navigator.clipboard.writeText(link.dataset.copyContact);
        copied = true;
      } catch (error) { /* Show a selectable account when clipboard access is unavailable. */ }
      if (version !== contactNoticeVersion || !contactToast) return;
      activeContact = link;
      contactToast.classList.remove('is-leaving');
      contactToast.classList.toggle('is-manual', !copied);
      if (copied) {
        contactToast.textContent = `${label} copied.`;
      } else {
        const value = document.createElement('span');
        value.className = 'contact-toast-value';
        value.textContent = link.dataset.copyContact;
        contactToast.replaceChildren(`Copy ${label} manually: `, value);
      }
      positionContactToast();
      contactToast.classList.add('is-visible');
      if (!copied) {
        const range = document.createRange();
        range.selectNodeContents(contactToast.querySelector('.contact-toast-value'));
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      dismissContactTimer = setTimeout(dismissContactToast, copied ? 500 : 8000);
    });
  });
  window.addEventListener('resize', positionContactToast);
  window.addEventListener('scroll', positionContactToast, { passive: true });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') dismissContactToast();
  });

  const dialog = document.querySelector('.framework-dialog');
  const dialogImage = dialog?.querySelector('.framework-dialog-image');
  const dialogTitle = dialog?.querySelector('.framework-dialog-title');
  const imageStatus = dialog?.querySelector('.framework-image-status');
  dialogImage?.addEventListener('load', () => {
    dialogImage.hidden = false;
    if (imageStatus) imageStatus.hidden = true;
  });
  dialogImage?.addEventListener('error', () => {
    dialogImage.hidden = true;
    if (imageStatus) { imageStatus.hidden = false; imageStatus.textContent = 'Unable to load this image. Please close the preview and try again.'; }
  });
  document.querySelectorAll('[data-framework-src]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!dialog || !dialogImage || !dialogTitle) return;
      dialogImage.hidden = true;
      if (imageStatus) { imageStatus.hidden = false; imageStatus.textContent = 'Loading image…'; }
      const thumbnail = button.querySelector('img');
      dialogImage.width = thumbnail?.naturalWidth || 1200;
      dialogImage.height = thumbnail?.naturalHeight || 800;
      dialogImage.src = button.dataset.frameworkSrc;
      dialogImage.alt = button.dataset.frameworkAlt;
      dialogTitle.textContent = `${button.dataset.frameworkName} — Framework`;
      dialog.showModal();
      document.body.classList.add('framework-open');
    });
  });
  dialog?.querySelector('.framework-close')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('close', () => document.body.classList.remove('framework-open'));
  dialog?.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });

  const navigation = document.querySelector('.site-navigation');
  const links = [...document.querySelectorAll('.site-navigation a')];
  const positionIndicator = () => {
    const active = navigation?.querySelector('[aria-current]');
    if (!active) return;
    navigation.style.setProperty('--indicator-left', `${active.offsetLeft}px`);
    navigation.style.setProperty('--indicator-width', `${active.offsetWidth}px`);
    requestAnimationFrame(() => navigation.setAttribute('data-indicator-ready', ''));
  };
  const sections = [...document.querySelectorAll('.page__content > section[id]')];
  let scheduled = false;
  const updateNavigation = () => {
    const threshold = (document.querySelector('.masthead')?.getBoundingClientRect().height || 56) + 40;
    let active = sections[0];
    sections.forEach((section) => { if (section.getBoundingClientRect().top <= threshold) active = section; });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) active = sections[sections.length - 1];
    const destination = sections.find((section) => `#${section.id}` === window.location.hash);
    if (destination) {
      const bounds = destination.getBoundingClientRect();
      if (bounds.top < window.innerHeight && bounds.bottom > threshold) active = destination;
    }
    links.forEach((link) => {
      if (active && link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    positionIndicator();
    scheduled = false;
  };
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateNavigation); }
  }, { passive: true });
  window.addEventListener('resize', updateNavigation);
  window.addEventListener('hashchange', updateNavigation);
  document.fonts?.ready.then(positionIndicator);
  updateNavigation();
})();
