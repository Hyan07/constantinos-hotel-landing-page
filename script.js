'use strict';

const WHATSAPP_NUMBER = '5535988448287';
const WHATSAPP_MESSAGE = "Olá! Vi o site do Constantino's Hotel e gostaria de consultar disponibilidade de quarto e estacionamento.";
const SYSTEM_URL = 'https://gestao.constantinoshotel.com.br/';

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

document.querySelectorAll('[data-whatsapp]').forEach((link) => {
  link.href = whatsappUrl;
});

const adminLink = document.querySelector('a[href="https://gestao.constantinoshotel.com.br/"]');
if (adminLink) adminLink.href = SYSTEM_URL;

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');

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

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1040) closeMenu();
  }, { passive: true });
}

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
