const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const bookingForm = document.getElementById('booking-form');
const bookingResponse = document.getElementById('booking-response');
const reserveDialog = document.getElementById('reserve-dialog');
const guestForm = document.getElementById('guest-form');
const dialogSummary = document.getElementById('dialog-summary');
const dialogSuccess = document.getElementById('dialog-success');
const formMessage = document.getElementById('form-message');
let currentSearch = null;

const SYSTEM_URL = 'https://aliceblue-raven-140682.hostingersite.com/sistema#/dashboard';
document.querySelector('[data-system-link]').href = SYSTEM_URL;

function toLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function formatDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(year, month - 1, day));
}

function nightsBetween(checkin, checkout) {
  const start = new Date(`${checkin}T12:00:00`);
  const end = new Date(`${checkout}T12:00:00`);
  return Math.max(1, Math.round((end - start) / 86400000));
}

function initializeDates() {
  const checkin = document.getElementById('checkin');
  const checkout = document.getElementById('checkout');
  const today = new Date();
  const tomorrow = addDays(today, 1);
  checkin.min = toLocalDate(today);
  checkout.min = toLocalDate(tomorrow);
  checkin.value = toLocalDate(today);
  checkout.value = toLocalDate(tomorrow);

  checkin.addEventListener('change', () => {
    if (!checkin.value) return;
    const [year, month, day] = checkin.value.split('-').map(Number);
    const minCheckout = addDays(new Date(year, month - 1, day), 1);
    checkout.min = toLocalDate(minCheckout);
    if (!checkout.value || checkout.value <= checkin.value) checkout.value = toLocalDate(minCheckout);
  });
}

function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 32);
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

menuToggle.addEventListener('click', () => {
  const willOpen = mobileNav.hidden;
  mobileNav.hidden = !willOpen;
  menuToggle.setAttribute('aria-expanded', String(willOpen));
});

mobileNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileNav.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(bookingForm));
  if (!values.checkin || !values.checkout || values.checkout <= values.checkin) {
    bookingResponse.hidden = false;
    bookingResponse.innerHTML = '<strong>Confira as datas.</strong> O check-out precisa ser posterior ao check-in.';
    return;
  }

  const nights = nightsBetween(values.checkin, values.checkout);
  currentSearch = { ...values, nights };
  const people = Number(values.adults) + Number(values.children);
  bookingResponse.hidden = false;
  bookingResponse.innerHTML = `<strong>${formatDate(values.checkin)} → ${formatDate(values.checkout)}</strong> · ${nights} ${nights === 1 ? 'noite' : 'noites'} · ${people} ${people === 1 ? 'hóspede' : 'hóspedes'}. <button type="button" id="open-reserve">Continuar reserva →</button>`;
  const continueButton = bookingResponse.querySelector('#open-reserve');
  continueButton.style.cssText = 'border:0;background:none;color:#164865;font:inherit;font-weight:800;cursor:pointer;padding:0 0 0 8px';
  continueButton.addEventListener('click', openReserveDialog);
});

function openReserveDialog() {
  if (!currentSearch) return;
  const people = Number(currentSearch.adults) + Number(currentSearch.children);
  dialogSummary.textContent = `${formatDate(currentSearch.checkin)} a ${formatDate(currentSearch.checkout)} · ${currentSearch.nights} ${currentSearch.nights === 1 ? 'noite' : 'noites'} · ${people} ${people === 1 ? 'hóspede' : 'hóspedes'}.`;
  guestForm.hidden = false;
  dialogSuccess.hidden = true;
  formMessage.hidden = true;
  reserveDialog.showModal();
  document.body.classList.add('dialog-open');
  setTimeout(() => guestForm.elements.name.focus(), 0);
}

function closeDialog() {
  reserveDialog.close();
  document.body.classList.remove('dialog-open');
}

document.querySelectorAll('[data-dialog-close]').forEach((button) => button.addEventListener('click', closeDialog));
reserveDialog.addEventListener('click', (event) => {
  const rect = reserveDialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) closeDialog();
});
reserveDialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));

guestForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const guest = Object.fromEntries(new FormData(guestForm));
  if (!guest.phone.trim() && !guest.email.trim()) {
    formMessage.textContent = 'Informe pelo menos telefone ou e-mail para contato.';
    formMessage.hidden = false;
    return;
  }

  const reservation = {
    id: `CT-${Date.now().toString().slice(-8)}`,
    createdAt: new Date().toISOString(),
    search: currentSearch,
    guest,
  };

  const stored = JSON.parse(localStorage.getItem('constantinos_demo_reservations') || '[]');
  stored.push(reservation);
  localStorage.setItem('constantinos_demo_reservations', JSON.stringify(stored));

  guestForm.reset();
  guestForm.hidden = true;
  dialogSuccess.hidden = false;
  formMessage.hidden = true;
});

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    obs.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const counterObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.counter);
    const duration = 900;
    const start = performance.now();

    function animate(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
    obs.unobserve(element);
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-counter]').forEach((element) => counterObserver.observe(element));

initializeDates();
