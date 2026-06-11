/* WORQsense · main.js */

(function () {
  'use strict';

  // ── Navigation ──────────────────────────────────────────────────────────────
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
    }, { passive: true });

    if (navToggle) {
      navToggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
    }

    document.addEventListener('click', (e) => {
      if (nav.classList.contains('is-open') && !nav.contains(e.target)) {
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    if (navLinks) {
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          nav.classList.remove('is-open');
          document.body.style.overflow = '';
          if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link').forEach(link => {
      const href = (link.getAttribute('href') || '').split('/').pop();
      const isHome = (href === 'index.html' || href === '') &&
                     (path === 'index.html' || path === '');
      if (href === path || isHome) link.classList.add('active');
    });
  }

  // ── Scroll Reveal ────────────────────────────────────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

  // ── Smooth scroll for anchor links ───────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const navH = nav ? nav.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Contact form ─────────────────────────────────────────────────────────────
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      /*
       * Replace with your form endpoint, e.g. Formspree or Netlify Forms:
       *
       * const res = await fetch('https://formspree.io/f/YOUR_ID', {
       *   method: 'POST',
       *   body: new FormData(contactForm),
       *   headers: { Accept: 'application/json' }
       * });
       * if (res.ok) { showSuccess(); } else { showError(); }
       */

      setTimeout(() => {
        contactForm.innerHTML = `
          <div style="text-align:center;padding:3rem 1rem;">
            <div style="font-size:2.5rem;color:var(--cta);margin-bottom:1rem;">&#10003;</div>
            <h3 style="color:var(--text);margin-bottom:0.5rem;">Message received.</h3>
            <p style="color:var(--text-muted);">We'll be in touch within one business day.</p>
          </div>`;
      }, 900);
    });
  }

  // ── Newsletter form ───────────────────────────────────────────────────────────
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn   = form.querySelector('button');
      btn.textContent = 'Subscribed ✓';
      btn.disabled = true;
      if (input) input.disabled = true;
    });
  });

  // ── Hero Carousel ─────────────────────────────────────────────────────────────
  const heroStage = document.getElementById('heroStage');
  if (heroStage) {
    const slides = Array.from(heroStage.querySelectorAll('.hero-slide'));
    const dots   = Array.from(document.querySelectorAll('#heroDots .hero__dot'));
    const count  = document.getElementById('heroCount');
    let i = 0, timer;

    const pad = n => String(n + 1).padStart(2, '0');

    function go(n) {
      i = ((n % slides.length) + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
      dots.forEach((d, k)   => d.classList.toggle('is-active', k === i));
      if (count) count.textContent = pad(i) + ' / ' + pad(slides.length - 1);
    }

    function play() { clearInterval(timer); timer = setInterval(() => go(i + 1), 5200); }

    dots.forEach((d, k) => d.addEventListener('click', () => { go(k); play(); }));

    go(0);
    play();
  }

})();
