/**
 * Verbo Taller – Landing Page Scripts
 * Handles: navbar, smooth scroll, scroll animations, form, back-to-top
 */

(function () {
  'use strict';

  // ─── Navbar ───────────────────────────────────────────────────────────────
  const navbar     = document.getElementById('navbar');
  const navToggle  = document.getElementById('nav-toggle');
  const navMenu    = document.getElementById('nav-menu');
  const navLinks   = navMenu ? navMenu.querySelectorAll('.navbar__link') : [];

  /** Add/remove scrolled class */
  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /** Open / close mobile menu */
  function toggleMenu(forceClose) {
    const isOpen = navMenu.classList.contains('open');
    if (forceClose === true || isOpen) {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      navMenu.classList.add('open');
      navToggle.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () { toggleMenu(); });
  }

  // Close menu when a link is clicked
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () { toggleMenu(true); });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (
      navMenu &&
      navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      toggleMenu(true);
    }
  });

  // ─── Active nav link on scroll ────────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollY = window.scrollY + 100;
    sections.forEach(function (section) {
      const sectionTop    = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const id            = section.getAttribute('id');
      const link          = navMenu
        ? navMenu.querySelector('.navbar__link[href="#' + id + '"]')
        : null;
      if (link) {
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  // ─── Back-to-top ──────────────────────────────────────────────────────────
  const backToTopBtn = document.getElementById('back-to-top');

  function handleBackToTop() {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── Scroll animations (Intersection Observer) ───────────────────────────
  function initScrollAnimations() {
    const animatables = document.querySelectorAll(
      '.service-card, .portfolio-card, .testimonial-card, .process__step, ' +
      '.about__content, .about__img-wrapper, .section-header, .contact__info, ' +
      '.contact__form-wrapper'
    );

    animatables.forEach(function (el) {
      el.classList.add('fade-in');
    });

    if (!('IntersectionObserver' in window)) {
      // Fallback: show all immediately
      animatables.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    animatables.forEach(function (el) { observer.observe(el); });
  }

  // ─── Contact Form ─────────────────────────────────────────────────────────
  // To enable email delivery to verbosd@gmail.com:
  //   1. Sign up at https://formspree.io (free tier is enough)
  //   2. Create a new form, set the destination to verbosd@gmail.com
  //   3. Replace 'YOUR_FORM_ID' below with the form ID Formspree gives you
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

  const contactForm   = document.getElementById('contact-form');
  const formSuccess   = document.getElementById('form-success');
  const submitBtn     = contactForm
    ? contactForm.querySelector('.contact-form__submit')
    : null;

  function validateField(input) {
    const errorEl = input.parentElement.querySelector('.contact-form__error');
    let message   = '';

    if (input.required && !input.value.trim()) {
      message = 'Este campo es obligatorio.';
    } else if (input.type === 'email' && input.value.trim()) {
      const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailReg.test(input.value.trim())) {
        message = 'Ingresa un email válido.';
      }
    }

    if (errorEl) {
      errorEl.textContent = message;
    }
    if (message) {
      input.classList.add('error');
    } else {
      input.classList.remove('error');
    }

    return message === '';
  }

  function validateForm() {
    const fields = contactForm.querySelectorAll(
      'input[required], select[required], textarea[required]'
    );
    let valid = true;
    fields.forEach(function (field) {
      if (!validateField(field)) valid = false;
    });
    return valid;
  }

  if (contactForm) {
    // Live validation on blur
    contactForm.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
      field.addEventListener('input', function () {
        if (field.classList.contains('error')) validateField(field);
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateForm()) return;

      // Guard: warn in development if Formspree has not been configured yet
      if (FORMSPREE_ENDPOINT.indexOf('YOUR_FORM_ID') !== -1) {
        console.warn(
          'Formspree no está configurado. Reemplaza YOUR_FORM_ID en js/main.js ' +
          'con el ID de tu formulario de https://formspree.io'
        );
      }

      // Submit form data to Formspree (sends email to verbosd@gmail.com
      // with subject "Contacto de la web")
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      var formData = new FormData(contactForm);

      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;

          if (response.ok) {
            contactForm.reset();
            if (formSuccess) {
              formSuccess.style.display = 'block';
              setTimeout(function () {
                formSuccess.style.display = 'none';
              }, 6000);
            }
          } else {
            response.json()
              .then(function (data) {
                var msg = (data.errors && data.errors.length)
                  ? data.errors.map(function (err) { return err.message; }).join(', ')
                  : 'Hubo un error al enviar el mensaje. Por favor intenta de nuevo.';
                alert(msg);
              })
              .catch(function () {
                alert('Hubo un error al enviar el mensaje. Por favor intenta de nuevo.');
              });
          }
        })
        .catch(function () {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          alert('Hubo un error al enviar el mensaje. Por favor intenta de nuevo.');
        });
    });
  }

  // ─── Footer year ──────────────────────────────────────────────────────────
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ─── Global scroll handler (throttled) ────────────────────────────────────
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        handleNavbarScroll();
        updateActiveLink();
        handleBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  }

  // ─── Init ─────────────────────────────────────────────────────────────────
  window.addEventListener('scroll', onScroll, { passive: true });
  handleNavbarScroll();
  updateActiveLink();
  handleBackToTop();
  initScrollAnimations();

})();
