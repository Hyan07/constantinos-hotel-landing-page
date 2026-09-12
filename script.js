'use strict';

const WHATSAPP_NUMBER = '5535988448287';
const DEFAULT_MESSAGE = "Olá! Gostaria de informações sobre o Constantino's Hotel.";
// Troque para true quando quiser publicar novamente as fotos do estacionamento.
const SITE_CONFIG = Object.freeze({ showParkingGallery: false });

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const bookingForm = document.getElementById('booking-form');
const checkinInput = document.getElementById('checkin');
const toast = document.getElementById('toast');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function whatsappUrl(message = DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll('.js-whatsapp').forEach((link) => {
  link.href = whatsappUrl(link.dataset.message || DEFAULT_MESSAGE);
});

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

function closeMenu() {
  if (!menuToggle || !mobileNav) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  mobileNav.hidden = true;
  document.body.classList.remove('menu-open');
  header?.classList.remove('is-menu-open');
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    menuToggle.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu');
    mobileNav.hidden = !willOpen;
    document.body.classList.toggle('menu-open', willOpen);
    header?.classList.toggle('is-menu-open', willOpen);
  });

  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1020) closeMenu();
  }, { passive: true });
}

function updateHeader() {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const navLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
const sections = [...document.querySelectorAll('[data-nav-section][id]')];

if ('IntersectionObserver' in window && navLinks.length && sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!current) return;
    navLinks.forEach((link) => link.classList.toggle('is-active', link.hash === `#${current.target.id}`));
  }, { rootMargin: '-22% 0px -62% 0px', threshold: [0, .1, .35] });
  sections.forEach((section) => sectionObserver.observe(section));
}

const revealItems = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
  revealItems.forEach((item) => revealObserver.observe(item));
}

function toLocalIsoDate(date) {
  const yearPart = date.getFullYear();
  const monthPart = String(date.getMonth() + 1).padStart(2, '0');
  const dayPart = String(date.getDate()).padStart(2, '0');
  return `${yearPart}-${monthPart}-${dayPart}`;
}

function formatDate(dateValue) {
  const [yearPart, monthPart, dayPart] = dateValue.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR').format(new Date(yearPart, monthPart - 1, dayPart));
}

if (checkinInput) {
  const today = new Date();
  checkinInput.min = toLocalIsoDate(today);
  checkinInput.value = toLocalIsoDate(today);
}

if (bookingForm) {
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;

    const guests = document.getElementById('guests')?.value || '2 hóspedes';
    const vehicle = document.getElementById('vehicle')?.value || 'carro';
    const arrival = checkinInput?.value ? formatDate(checkinInput.value) : 'a combinar';
    const message = `Olá! Gostaria de consultar disponibilidade no Constantino's Hotel.\n\nChegada: ${arrival}\nHóspedes: ${guests}\nVeículo: ${vehicle}\n\nPodem me informar as opções e os valores?`;

    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
  });
}

const accordionItems = [...document.querySelectorAll('.accordion details')];
accordionItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    accordionItems.forEach((otherItem) => {
      if (otherItem !== item) otherItem.open = false;
    });
  });
});

const gallerySlot = document.querySelector('[data-photo-gallery]');
const galleryPlaceholder = document.querySelector('[data-gallery-placeholder]');
const galleryTemplate = document.getElementById('parking-gallery-template');

if (SITE_CONFIG.showParkingGallery && gallerySlot && galleryTemplate) {
  gallerySlot.append(galleryTemplate.content.cloneNode(true));
  gallerySlot.hidden = false;
  if (galleryPlaceholder) galleryPlaceholder.hidden = true;
}

const galleryButtons = [...document.querySelectorAll('[data-photo-gallery] .gallery-item')];
const lightbox = document.getElementById('gallery-lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxCaption = lightbox?.querySelector('figcaption');
let activeGalleryIndex = 0;

function renderLightbox(index) {
  if (!galleryButtons.length || !lightboxImage || !lightboxCaption) return;
  activeGalleryIndex = (index + galleryButtons.length) % galleryButtons.length;
  const sourceImage = galleryButtons[activeGalleryIndex].querySelector('img');
  const caption = galleryButtons[activeGalleryIndex].querySelector('span');
  if (!sourceImage) return;
  lightboxImage.src = sourceImage.src;
  lightboxImage.alt = sourceImage.alt;
  lightboxCaption.textContent = caption?.textContent || sourceImage.alt;
}

galleryButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    if (!lightbox) return;
    renderLightbox(index);
    if (typeof lightbox.showModal === 'function') lightbox.showModal();
  });
});

lightbox?.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.close());
lightbox?.querySelector('.lightbox-prev')?.addEventListener('click', () => renderLightbox(activeGalleryIndex - 1));
lightbox?.querySelector('.lightbox-next')?.addEventListener('click', () => renderLightbox(activeGalleryIndex + 1));
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
  if (!lightbox?.open) return;
  if (event.key === 'ArrowLeft') renderLightbox(activeGalleryIndex - 1);
  if (event.key === 'ArrowRight') renderLightbox(activeGalleryIndex + 1);
});

if (toast) {
  window.addEventListener('offline', () => {
    toast.textContent = 'Você está sem conexão. O WhatsApp será aberto quando a internet voltar.';
    toast.classList.add('is-visible');
  });
  window.addEventListener('online', () => {
    toast.textContent = 'Conexão restabelecida.';
    toast.classList.add('is-visible');
    window.setTimeout(() => toast.classList.remove('is-visible'), 3000);
  });
}
