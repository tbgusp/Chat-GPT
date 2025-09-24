const emailPattern = /^(?:[a-zA-Z0-9_'^&+%=-]+(?:\.[a-zA-Z0-9_'^&+%=-]+)*|"[^"]+")@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.primary-nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelectorAll('.nav-list a');

  if (menuToggle && nav) {
    const toggleNav = () => {
      const isOpen = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    };

    menuToggle.addEventListener('click', toggleNav);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  const projectCards = document.querySelectorAll('.project-card');
  const filterButtons = document.querySelectorAll('.filter-button');
  const submenuFilters = document.querySelectorAll('.submenu a[data-filter]');

  const setActiveFilterButton = (filter) => {
    filterButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
  };

  const applyProjectFilter = (filter) => {
    projectCards.forEach((card) => {
      const category = card.dataset.category;
      const shouldShow = filter === 'all' || category === filter;
      card.style.display = shouldShow ? '' : 'none';
    });
    setActiveFilterButton(filter);
  };

  if (filterButtons.length) {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        applyProjectFilter(button.dataset.filter || 'all');
      });
    });
  }

  if (submenuFilters.length) {
    submenuFilters.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const filter = link.dataset.filter || 'all';
        applyProjectFilter(filter);
        const matchingButton = document.querySelector(
          `.filter-button[data-filter="${filter}"]`
        );
        if (matchingButton) {
          matchingButton.focus();
        }
        const targetSection = document.querySelector('#projects');
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const errors = {};

      const name = (formData.get('name') || '').trim();
      if (name.length < 2) {
        errors.name = 'Nama minimal 2 karakter.';
      }

      const email = (formData.get('email') || '').trim();
      if (!emailPattern.test(email)) {
        errors.email = 'Masukkan email yang valid.';
      }

      const service = formData.get('service') || '';
      if (!service) {
        errors.service = 'Pilih jenis layanan yang dibutuhkan.';
      }

      const message = (formData.get('message') || '').trim();
      if (message.length < 20) {
        errors.message = 'Ringkasan kebutuhan minimal 20 karakter.';
      }

      const errorFields = contactForm.querySelectorAll('.error-message');
      errorFields.forEach((field) => {
        field.textContent = '';
      });

      const feedback = contactForm.querySelector('.form-feedback');
      if (feedback) {
        feedback.textContent = '';
      }

      Object.entries(errors).forEach(([field, message]) => {
        const errorElement = contactForm.querySelector(`.error-message[data-for="${field}"]`);
        if (errorElement) {
          errorElement.textContent = message;
        }
      });

      const hasErrors = Object.keys(errors).length > 0;
      if (!hasErrors) {
        if (feedback) {
          feedback.textContent = 'Terima kasih! Tim kami akan menghubungi Anda segera.';
        }
        contactForm.reset();
      }
    });
  }

  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const feedback = newsletterForm.querySelector('.newsletter-feedback');

      if (feedback) {
        feedback.textContent = '';
      }

      if (emailInput) {
        const value = emailInput.value.trim();
        if (!emailPattern.test(value)) {
          if (feedback) {
            feedback.textContent = 'Mohon masukkan email yang valid.';
          }
          return;
        }

        if (feedback) {
          feedback.textContent = 'Terima kasih! Silakan cek email Anda untuk konfirmasi.';
        }
        newsletterForm.reset();
      }
    });
  }

  const faqButtons = document.querySelectorAll('.faq-item button');
  if (faqButtons.length) {
    faqButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        faqButtons.forEach((btn) => {
          btn.setAttribute('aria-expanded', 'false');
          const parent = btn.closest('.faq-item');
          if (parent) {
            parent.classList.remove('active');
          }
        });

        if (!isExpanded && item) {
          button.setAttribute('aria-expanded', 'true');
          item.classList.add('active');
        }
      });
    });
  }

  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  applyProjectFilter('all');
});
