(() => {
  'use strict';
  const nav = document.querySelector('nav.nav');
  const toggle = nav && nav.querySelector('.menu-toggle');
  const links = document.getElementById('primary-navigation');
  if (!nav || !toggle || !links) return;
  const mobile = window.matchMedia('(max-width:1000px)');
  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    links.classList.toggle('is-open', open);
  }
  setOpen(false);
  toggle.hidden = false;
  nav.classList.add('menu-enhanced');
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  links.addEventListener('click', event => {
    if (mobile.matches && event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (mobile.matches && event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (mobile.matches && !nav.contains(event.target)) setOpen(false);
  });
  mobile.addEventListener('change', () => setOpen(false));
})();
