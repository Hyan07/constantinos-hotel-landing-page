(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = mobileNav ? [...mobileNav.querySelectorAll('a')] : [];
  const desktopLinks = [...document.querySelectorAll('.desktop-nav a')];

  function closeMenu() {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    mobileNav.hidden = true;
    document.body.classList.remove('menu-open');
  }

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
      mobileNav.hidden = isOpen;
      document.body.classList.toggle('menu-open', !isOpen);
    });

    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) closeMenu();
    });
  }

  document.querySelectorAll('.js-whatsapp').forEach(link => {
    const message = link.dataset.message?.trim();
    if (!message) return;
    link.href = `https://wa.me/5535988448287?text=${encodeURIComponent(message)}`;
  });

  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      const id = `#${visible.target.id}`;
      desktopLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === id));
    }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, .2, .5] });

    sections.forEach(section => observer.observe(section));
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
