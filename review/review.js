(() => {
  const form = document.getElementById('reviewForm');
  const reviewCard = document.getElementById('reviewCard');
  const successCard = document.getElementById('successCard');
  const invitationCard = document.getElementById('invitationCard');
  const ratingField = document.getElementById('ratingField');
  const ratingError = document.getElementById('ratingError');
  const tokenField = document.getElementById('tokenField');
  const stars = Array.from(document.querySelectorAll('.star'));

  const params = new URLSearchParams(window.location.search);
  const reviewToken = (params.get('token') || '').trim();
  tokenField.value = reviewToken;

  if (!reviewToken && params.get('sent') !== '1') {
    reviewCard.hidden = true;
    invitationCard.hidden = false;
  }

  if (params.get('sent') === '1') {
    reviewCard.hidden = true;
    successCard.hidden = false;
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const setRating = (rating) => {
    ratingField.value = String(rating);
    ratingError.textContent = '';
    stars.forEach((star) => {
      const value = Number(star.dataset.rating);
      const active = value <= rating;
      star.classList.toggle('active', active);
      star.setAttribute('aria-checked', value === rating ? 'true' : 'false');
    });
  };

  stars.forEach((star) => {
    star.setAttribute('role', 'radio');
    star.setAttribute('aria-checked', 'false');
    star.addEventListener('click', () => setRating(Number(star.dataset.rating)));
    star.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      const current = Number(ratingField.value || star.dataset.rating);
      const next = event.key === 'ArrowLeft' || event.key === 'ArrowDown'
        ? Math.max(1, current - 1)
        : Math.min(5, current + 1);
      setRating(next);
      stars[next - 1].focus();
    });
  });

  form.addEventListener('submit', (event) => {
    if (!ratingField.value) {
      event.preventDefault();
      ratingError.textContent = 'Bitte wählen Sie eine Bewertung von 1 bis 5 Sternen.';
      stars[0].focus();
      return;
    }

    const honeypot = form.elements.website;
    if (honeypot && honeypot.value) {
      event.preventDefault();
    }
  });
})();
