'use strict';

const button = document.querySelector('.menu-button');
const nav = document.querySelector('.nav-links');

if (button && nav) {
  button.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
    });
  });
}

const promoModal = document.getElementById('promoModal');

if (promoModal) {
  const promoEndsAt = new Date('2026-08-02T23:59:00+02:00').getTime();
  const todayKey = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
  const storageKey = 'sd-promo-seen-2026-08-02';

  const closePromo = () => {
    promoModal.classList.remove('open');
    promoModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('promo-open');
    localStorage.setItem(storageKey, todayKey);
  };

  const alreadySeenToday = localStorage.getItem(storageKey) === todayKey;

  if (Date.now() < promoEndsAt && !alreadySeenToday) {
    window.setTimeout(() => {
      promoModal.classList.add('open');
      promoModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('promo-open');
      promoModal.querySelector('.promo-close').focus();
    }, 700);
  }

  promoModal.querySelectorAll('[data-promo-close]').forEach((element) => {
    element.addEventListener('click', closePromo);
  });

  promoModal.querySelector('.promo-button').addEventListener('click', () => {
    localStorage.setItem(storageKey, todayKey);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && promoModal.classList.contains('open')) {
      closePromo();
    }
  });
}
