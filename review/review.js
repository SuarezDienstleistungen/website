(() => {
  const SUPABASE_URL = 'https://vbmxughmhctjphcmmqcz.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_ccZ8NsrcLySLjVLu4Q4A0A_35ixUZ2I';
  const FORMSPREE_URL = 'https://formspree.io/f/xrenakak';

  const form = document.getElementById('reviewForm');
  const reviewCard = document.getElementById('reviewCard');
  const successCard = document.getElementById('successCard');
  const ratingField = document.getElementById('ratingField');
  const ratingError = document.getElementById('ratingError');
  const stars = Array.from(document.querySelectorAll('.star'));
  const submitButton = form?.querySelector('button[type="submit"]');

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

  const showSuccess = () => {
    reviewCard.hidden = true;
    successCard.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sendFormspreeCopy = async (formData) => {
    try {
      await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });
    } catch (_) {
      // Supabase ist die führende Quelle. Formspree bleibt nur als Benachrichtigungs-Backup.
    }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!ratingField.value) {
      ratingError.textContent = 'Bitte wählen Sie eine Bewertung von 1 bis 5 Sternen.';
      stars[0].focus();
      return;
    }

    const honeypot = form.elements.website;
    if (honeypot && honeypot.value) return;

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') || '').trim() || null,
      email: String(data.get('email') || '').trim(),
      city: String(data.get('ort') || '').trim() || null,
      service: String(data.get('service') || '').trim() || null,
      rating: Number(ratingField.value),
      comment: String(data.get('kommentar') || '').trim(),
      consent_publish: data.get('veroeffentlichung') === 'Erlaubt',
      consent_name: data.get('name_veroeffentlichen') === 'Ja',
      consent_city: data.get('ort_veroeffentlichen') === 'Ja',
      privacy_accepted: data.get('datenschutz') === 'Akzeptiert',
      status: 'pending'
    };

    submitButton.disabled = true;
    submitButton.textContent = 'Wird gesendet…';
    ratingError.textContent = '';

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/reviews`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || 'Supabase insert failed');
      }

      // E-Mail-Benachrichtigung als zusätzliche Kopie; ein Fehler hier blockiert die Bewertung nicht.
      sendFormspreeCopy(data);
      form.reset();
      ratingField.value = '';
      stars.forEach((star) => {
        star.classList.remove('active');
        star.setAttribute('aria-checked', 'false');
      });
      showSuccess();
    } catch (error) {
      console.error(error);
      ratingError.textContent = 'Die Bewertung konnte gerade nicht gesendet werden. Bitte versuchen Sie es erneut.';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Bewertung senden';
    }
  });
})();
