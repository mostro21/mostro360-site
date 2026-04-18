/* MOSTRO 360 — Main JavaScript */

/* Sticky Navbar */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* Hamburger Menu */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    }
  });
  navLinks.querySelectorAll('a:not(.nav-dropdown-toggle)').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* Dropdown — click based */
document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
  toggle.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    const menu = toggle.nextElementSibling;
    const isOpen = menu.classList.contains('open');
    document.querySelectorAll('.nav-dropdown-menu').forEach(m => m.classList.remove('open'));
    if (!isOpen) menu.classList.add('open');
  });
});

document.addEventListener('click', e => {
  if (!e.target.closest('.nav-dropdown')) {
    document.querySelectorAll('.nav-dropdown-menu').forEach(m => m.classList.remove('open'));
  }
});

/* FAQ Accordion */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', false);
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', true);
    }
  });
});

/* Smooth Scroll */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = (navbar ? navbar.offsetHeight : 0) + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* Scroll Animations */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = parseInt(el.dataset.animateDelay || 0);
    setTimeout(() => el.classList.add('animated'), delay);
    observer.unobserve(el);
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
