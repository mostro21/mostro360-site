/* ============================================
   MOSTRO 360 — Main JavaScript
   ============================================ */

/* --- Sticky Navbar --- */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* --- Hamburger Menu --- */
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
  navLinks.querySelectorAll('a').forEach(link => {
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

/* --- FAQ Accordion --- */
const FAQ_EXCLUSIVE = true;
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    if (FAQ_EXCLUSIVE) {
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', false);
      });
    }
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', true);
    }
  });
  btn.setAttribute('aria-expanded', false);
  btn.setAttribute('role', 'button');
});

/* --- Smooth Scroll --- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      target.scrollIntoView();
      return;
    }
    const offset = (navbar ? navbar.offsetHeight : 0) + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    history.pushState(null, '', a.getAttribute('href'));
  });
});

/* --- Scroll Animations --- */
const animStyles = `
  [data-animate]{opacity:0;transform:translateY(30px);transition:opacity .6s ease,transform .6s ease}
  [data-animate="fade-left"]{transform:translateX(-30px)}
  [data-animate="fade-right"]{transform:translateX(30px)}
  [data-animate="fade-scale"]{transform:scale(.95)}
  [data-animate="fade"]{transform:none}
  [data-animate].animated{opacity:1;transform:none}
`;
const styleTag = document.createElement('style');
styleTag.textContent = animStyles;
document.head.appendChild(styleTag);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = parseInt(el.dataset.animateDelay || 0);
    setTimeout(() => el.classList.add('animated'), delay);
    const group = el.dataset.animateGroup;
    if (group) {
      document.querySelectorAll(`[data-animate-group="${group}"]`).forEach((sibling, i) => {
        setTimeout(() => sibling.classList.add('animated'), i * 80);
      });
    }
    observer.unobserve(el);
  });
}, { threshold: 0.12 });

function initAnimations() {
  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}
initAnimations();
window.Mostro = { refreshAnimations: initAnimations };

/* --- Nav Dropdown on Mobile --- */
document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
  toggle.addEventListener('click', e => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const menu = toggle.nextElementSibling;
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
      menu.style.position = 'static';
      menu.style.opacity = '1';
      menu.style.pointerEvents = 'all';
      menu.style.boxShadow = 'none';
      menu.style.border = 'none';
      menu.style.padding = '0 0 0 1rem';
    }
  });
});