(function () {
  const root = document.querySelector('[data-carousel]');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('[data-slide]'));
  const prevBtn = root.querySelector('[data-prev]');
  const nextBtn = root.querySelector('[data-next]');
  const pauseBtn = root.querySelector('[data-pause]');
  const status = root.querySelector('[data-status]');
  const dots = Array.from(root.querySelectorAll('[data-dot]'));

  let index = 0;
  let autoplay = true;
  let timer = null;

  function announce(msg) {
    if (!status) return;
    status.textContent = '';
    setTimeout(() => (status.textContent = msg), 10);
  }

  function setDots(activeIndex) {
    dots.forEach((btn, i) => {
      if (i === activeIndex) {
        btn.setAttribute('aria-current', 'true');
      } else {
        btn.removeAttribute('aria-current');
      }
    });
  }

  function setSlideFocusability(activeIndex) {
    slides.forEach((slide, i) => {
      const links = slide.querySelectorAll('a, button, input, select, textarea, [tabindex]');
      links.forEach((el) => {
        if (i === activeIndex) {
          // Restore default focusability
          if (el.__prevTabIndex !== undefined) {
            el.setAttribute('tabindex', el.__prevTabIndex);
            delete el.__prevTabIndex;
          } else if (el.getAttribute('tabindex') === '-1') {
            el.removeAttribute('tabindex');
          }
        } else {
          // Prevent focus on hidden slides
          if (el.hasAttribute('tabindex')) el.__prevTabIndex = el.getAttribute('tabindex');
          el.setAttribute('tabindex', '-1');
        }
      });
    });
  }

  function showSlide(newIndex) {
    index = (newIndex + slides.length) % slides.length;

    slides.forEach((s, i) => {
      const isActive = i === index;
      if (isActive) s.removeAttribute('hidden');
      else s.setAttribute('hidden', '');
    });

    setSlideFocusability(index);
    setDots(index);

    announce(`Slide ${index + 1} of ${slides.length}`);
  }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(() => {
      if (!autoplay) return;
      showSlide(index + 1);
    }, 5000);
  }

  function stopAutoplay() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  prevBtn?.addEventListener('click', () => showSlide(index - 1));
  nextBtn?.addEventListener('click', () => showSlide(index + 1));

  dots.forEach((btn) => {
    btn.addEventListener('click', () => {
      const to = Number(btn.getAttribute('data-to'));
      if (!Number.isNaN(to)) showSlide(to);
    });
  });

  pauseBtn?.addEventListener('click', () => {
    autoplay = !autoplay;
    pauseBtn.setAttribute('aria-pressed', String(!autoplay));
    pauseBtn.setAttribute('aria-label', autoplay ? 'Pause carousel' : 'Resume carousel');

    if (!autoplay) stopAutoplay();
    else startAutoplay();
  });

  // Init
  showSlide(0);
  startAutoplay();
})();