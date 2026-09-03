'use strict';

const WHATSAPP_NUMBER = '5535988448287';
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const year = document.getElementById('year');

function buildWhatsappUrl(message) {
  const text = message || "Olá! Gostaria de informações sobre o Constantino's Hotel.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

document.querySelectorAll('.js-whatsapp').forEach((link) => {
  link.href = buildWhatsappUrl(link.dataset.message);
});

if (year) {
  year.textContent = String(new Date().getFullYear());
}

function closeMenu() {
  if (!menuToggle || !mobileNav) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  mobileNav.hidden = true;
  document.body.classList.remove('menu-open');
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
    mobileNav.hidden = isOpen;
    document.body.classList.toggle('menu-open', !isOpen);
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1020) closeMenu();
  }, { passive: true });
}

function updateHeaderState() {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 12);
}

updateHeaderState();
window.addEventListener('scroll', updateHeaderState, { passive: true });

const navLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
const observedSections = [...document.querySelectorAll('[data-nav-section]')];

if ('IntersectionObserver' in window && navLinks.length && observedSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    const sectionId = visible.target.id;
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${sectionId}`);
    });
  }, {
    rootMargin: '-25% 0px -55% 0px',
    threshold: [0, .2, .45, .7]
  });

  observedSections.forEach((section) => sectionObserver.observe(section));
}
