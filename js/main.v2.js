/* MOSTRO 360 — Main JavaScript */

/* Sticky Navbar */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* ── Mobile Nav ── */
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-links');
const dropdownToggle = document.querySelector('.nav-dropdown-toggle');

function openNav() {
  navMenu.classList.add('open');
  document.body.classList.add('nav-open');
  document.body.style.overflow = 'hidden';
  hamburger.setAttribute('aria-expanded', 'true');
}

function closeNav() {
  navMenu.classList.remove('open');
  document.body.classList.remove('nav-open');
  document.body.style.overflow = '';
  hamburger.setAttribute('aria-expanded', 'false');
  document.querySelectorAll('.nav-dropdown').forEach(function(d) {
    d.classList.remove('active');
  });
}

if (hamburger && navMenu) {
  hamburger.addEventListener('click', function() {
    if (navMenu.classList.contains('open')) {
      closeNav();
    } else {
      openNav();
    }
  });

  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) closeNav();
  });
}

/* Dropdown toggle — mobile: expand inline; desktop: float */
if (dropdownToggle) {
  dropdownToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.closest('.nav-dropdown').classList.toggle('active');
  });
}

/* Nav link taps — close menu then navigate (fixes iOS fixed-position timing) */
document.querySelectorAll('.nav-links a:not(.nav-dropdown-toggle)').forEach(function(link) {
  link.addEventListener('click', function(e) {
    var href = this.getAttribute('href');
    if (!href || href === '#') return;
    e.preventDefault();
    closeNav();
    setTimeout(function() {
      window.location.href = href;
    }, 200);
  });
});

/* Keyboard close */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeNav();
});

/* Desktop: close dropdown on outside click */
document.addEventListener('click', function(e) {
  if (!e.target.closest('.nav-dropdown')) {
    document.querySelectorAll('.nav-dropdown').forEach(function(d) {
      d.classList.remove('active');
    });
  }
});

/* ── FAQ Accordion ── */
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

/* ── Smooth Scroll ── */
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

/* ── Scroll Animations ── */
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
