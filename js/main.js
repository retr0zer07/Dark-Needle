/* ============================================================
   DARK NEEDLE — main.js
   Navbar scroll, mobile menu, smooth scroll, reveal,
   gallery filter, counter animation, form handling
   ============================================================ */

(function () {
  'use strict';

  /* ── HELPERS ─────────────────────────────────────────────── */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const i18n = {
    es: {
      submitting: 'Enviando…',
      submitDefault: 'Enviar solicitud de reserva',
      successTitle: '¡Solicitud recibida!',
      successBody: 'Gracias — te contactaremos dentro de las próximas 24 horas.',
      themeToggleLabel: 'Cambiar entre modo claro y oscuro',
      themeToggleToDark: 'Cambiar a modo oscuro',
      themeToggleToLight: 'Cambiar a modo claro',
      galleryStatusPrefix: 'Mostrando estilo:',
    },
    en: {
      submitting: 'Sending…',
      submitDefault: 'Send booking request',
      successTitle: 'Request received!',
      successBody: 'Thank you — we will contact you within the next 24 hours.',
      themeToggleLabel: 'Switch between light and dark mode',
      themeToggleToDark: 'Switch to dark mode',
      themeToggleToLight: 'Switch to light mode',
      galleryStatusPrefix: 'Showing style:',
    },
  };
  const LOCALE_KEY = 'dark-needle-locale';
  const localeSelects = $$('.lang-select');
  let currentLocale = 'es';
  const copyFor = (locale) => i18n[locale] || i18n.es;

  /* ── NAVBAR ──────────────────────────────────────────────── */
  const header = $('#site-header');
  const burger = $('#nav-burger');
  const navLinks = $('#nav-links');
  const themeToggle = $('#theme-toggle');
  const form = $('#booking-form');
  const formSuccess = $('#form-success');
  const formSuccessTitle = $('#form-success h3');
  const formSuccessBody = $('#form-success p');
  const mobileNavQuery = window.matchMedia('(max-width: 960px)');

  function handleScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  function closeMobileNav() {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  function handleMobileNavChange() {
    if (!mobileNavQuery.matches) {
      closeMobileNav();
    }
  }

  if (typeof mobileNavQuery.addEventListener === 'function') {
    mobileNavQuery.addEventListener('change', handleMobileNavChange);
  } else if (typeof mobileNavQuery.addListener === 'function') {
    mobileNavQuery.addListener(handleMobileNavChange);
  }

  /* ── THEME TOGGLE ─────────────────────────────────────────── */
  const THEME_KEY = 'dark-needle-theme';
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const savedTheme = (() => {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (err) {
      return null;
    }
  })();

  function applyTheme(theme) {
    const isLight = theme === 'light';
    document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(isLight));
      const t = copyFor(currentLocale);
      themeToggle.setAttribute('title', isLight ? t.themeToggleToDark : t.themeToggleToLight);
      themeToggle.setAttribute('aria-label', t.themeToggleLabel);
    }
  }

  function applyLocale(locale) {
    const normalized = locale === 'en' ? 'en' : 'es';
    currentLocale = normalized;
    const t = copyFor(normalized);
    document.documentElement.setAttribute('lang', normalized);

    localeSelects.forEach((select) => {
      if (select.value !== normalized) {
        select.value = normalized;
      }
    });

    if (formSuccessTitle && formSuccessBody) {
      formSuccessTitle.textContent = t.successTitle;
      formSuccessBody.textContent = t.successBody;
    }

    if (themeToggle) {
      themeToggle.setAttribute('aria-label', t.themeToggleLabel);
    }

    const galleryStatus = $('#gallery-status');
    if (galleryStatus) {
      const activeFilter = $('.filter-btn.active');
      const activeLabel = activeFilter ? activeFilter.textContent.trim() : 'Todos';
      galleryStatus.textContent = `${t.galleryStatusPrefix} ${activeLabel}`;
    }
  }

  applyTheme(savedTheme || (prefersLight ? 'light' : 'dark'));

  const savedLocale = (() => {
    try {
      return localStorage.getItem(LOCALE_KEY);
    } catch (err) {
      return null;
    }
  })();
  applyLocale(savedLocale || 'es');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const nextTheme = current === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
      try {
        localStorage.setItem(THEME_KEY, nextTheme);
      } catch (err) {
        /* ignore storage errors in privacy mode */
      }
    });
  }

  localeSelects.forEach((select) => {
    select.addEventListener('change', () => {
      applyLocale(select.value);
      try {
        localStorage.setItem(LOCALE_KEY, currentLocale);
      } catch (err) {
        /* ignore storage errors in privacy mode */
      }
    });
  });

  /* close mobile nav on link click */
  $$('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  /* ── SMOOTH SCROLL (fallback for older browsers) ─────────── */
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── REVEAL ON SCROLL (IntersectionObserver) ─────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  $$('.reveal').forEach((el) => revealObserver.observe(el));

  /* Hero content is above the fold — trigger immediately */
  const heroReveals = $$('.hero .reveal');
  heroReveals.forEach((el, i) => {
    setTimeout(() => el.classList.add('in-view'), 200 + i * 150);
  });

  /* fallback: ensure hidden reveals don't stay invisible (screenshots / edge cases) */
  setTimeout(() => {
    $$('.reveal:not(.in-view)').forEach((el) => el.classList.add('in-view'));
  }, 500);

  /* ── HERO PARTICLES ──────────────────────────────────────── */
  const particleContainer = $('#hero-particles');
  if (particleContainer) {
    const COUNT = 24;
    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      p.style.cssText = [
        `left: ${Math.random() * 100}%`,
        `top: ${40 + Math.random() * 55}%`,
        `animation-delay: ${Math.random() * 8}s`,
        `animation-duration: ${6 + Math.random() * 10}s`,
        `width: ${1 + Math.random() * 3}px`,
        `height: ${1 + Math.random() * 3}px`,
        `opacity: ${0.2 + Math.random() * 0.5}`,
      ].join(';');
      particleContainer.appendChild(p);
    }
  }

  /* ── GALLERY FILTER ──────────────────────────────────────── */
  const filterBtns = $$('.filter-btn');
  const galleryItems = $$('.gallery__item');
  const galleryStatus = $('#gallery-status');

  function applyGalleryFilter(filter, label) {
    const t = copyFor(currentLocale);
    galleryItems.forEach((item) => {
      const show = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('gallery__item--hidden', !show);
      if (show) {
        // re-trigger reveal for re-shown items
        item.classList.remove('in-view');
        revealObserver.observe(item);
      }
    });
    if (galleryStatus) {
      galleryStatus.textContent = `${t.galleryStatusPrefix} ${label}`;
    }
  }

  filterBtns.forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.classList.contains('active')));
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      const filter = btn.dataset.filter;
      applyGalleryFilter(filter, btn.textContent.trim());
    });
  });

  /* ── COUNTER ANIMATION ───────────────────────────────────── */
  const counters = $$('.stat__num[data-target]');
  let countersStarted = false;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      if (countersStarted) return;
      const visible = entries.some((e) => e.isIntersecting);
      if (visible) {
        countersStarted = true;
        counters.forEach(animateCounter);
        statsObserver.disconnect();
      }
    },
    { threshold: 0.5 }
  );

  if (counters.length) {
    statsObserver.observe(counters[0].closest('.stats-band') || document.body);
  }

  /* ── BOOKING FORM ────────────────────────────────────────── */
  if (form && formSuccess) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const t = copyFor(currentLocale);

      /* basic validation */
      const required = $$('[required]', form);
      let valid = true;

      required.forEach((field) => {
        if (field.type === 'checkbox') {
          if (!field.checked) { valid = false; highlightError(field); }
          else clearError(field);
        } else {
          if (!field.value.trim()) { valid = false; highlightError(field); }
          else clearError(field);
        }
      });

      if (!valid) return;

      /* simulate async submission */
      const submitBtn = $('[type="submit"]', form);
      submitBtn.disabled = true;
      submitBtn.textContent = t.submitting;

      setTimeout(() => {
        form.hidden = true;
        formSuccess.hidden = false;
        submitBtn.textContent = t.submitDefault;
      }, 900);
    });

    function highlightError(field) {
      field.style.borderColor = 'var(--clr-error)';
      field.addEventListener('input', () => clearError(field), { once: true });
    }

    function clearError(field) {
      field.style.borderColor = '';
    }
  }

  /* ── FOOTER YEAR ─────────────────────────────────────────── */
  const yearEl = $('#footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── ACTIVE NAV LINK (scroll spy) ───────────────────────── */
  const sections = $$('section[id]');
  const navItems = $$('.nav__link:not(.nav__link--cta)');

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navItems.forEach((link) => {
            const href = link.getAttribute('href');
            link.classList.toggle('nav__link--active', href === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-50% 0px -45% 0px', threshold: 0 }
  );

  sections.forEach((sec) => spyObserver.observe(sec));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMobileNav();
    }
  });

})();
