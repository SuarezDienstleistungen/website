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


// Öffentliche Kundenbewertungen.
// Die Datei reviews.json enthält ausschließlich bereits freigegebene öffentliche Daten.
const reviewsGrid = document.getElementById('reviewsGrid');
const reviewsEmpty = document.getElementById('reviewsEmpty');

if (reviewsGrid && reviewsEmpty) {
  const escapeText = (value) => String(value ?? '').trim();

  fetch('reviews.json', { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error('Bewertungen konnten nicht geladen werden.');
      return response.json();
    })
    .then((data) => {
      const reviews = Array.isArray(data.reviews) ? data.reviews : [];
      const published = reviews.filter((review) =>
        review &&
        review.status === 'published' &&
        Number.isInteger(review.rating) &&
        review.rating >= 1 &&
        review.rating <= 5 &&
        typeof review.text === 'string' &&
        review.text.trim().length > 0
      );

      if (!published.length) return;

      reviewsEmpty.hidden = true;
      reviewsGrid.replaceChildren();

      published.forEach((review) => {
        const article = document.createElement('article');
        article.className = 'review-public-card';

        const stars = document.createElement('div');
        stars.className = 'review-stars';
        stars.setAttribute('aria-label', `${review.rating} von 5 Sternen`);
        stars.textContent = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

        const quote = document.createElement('blockquote');
        quote.textContent = escapeText(review.text);

        const meta = document.createElement('div');
        meta.className = 'review-public-meta';

        const name = document.createElement('strong');
        name.textContent = escapeText(review.display_name) || 'Kundin / Kunde';
        meta.appendChild(name);

        const details = [review.service, review.city, review.date]
          .map(escapeText)
          .filter(Boolean);
        if (details.length) {
          const detailLine = document.createElement('span');
          detailLine.textContent = details.join(' · ');
          meta.appendChild(detailLine);
        }

        article.append(stars, quote, meta);
        reviewsGrid.appendChild(article);
      });
    })
    .catch(() => {
      // Bei einem Ladefehler bleibt bewusst nur der neutrale Leerzustand sichtbar.
    });
}
