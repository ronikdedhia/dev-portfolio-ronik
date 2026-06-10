/* ═══════════════════════════════════════════════
   RONIK DEDHIA PORTFOLIO — SCRIPTS
   ═══════════════════════════════════════════════ */

// ── Reading progress bar ──
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : '0%';
}, { passive: true });

// ── Navbar: transparent → frosted ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Typewriter ──
const roles = [
  'intelligent web apps',
  'AI-powered systems',
  'full-stack products',
  'LLM pipelines',
  'production-ready APIs',
  'GenAI experiences',
];
let roleIdx = 0, charIdx = 0, deleting = false, paused = false;
const typeEl = document.getElementById('typewriter');

function type() {
  if (!typeEl) return;
  const current = roles[roleIdx];
  if (paused) {
    paused = false; deleting = true;
    setTimeout(type, 2200);
    return;
  }
  if (!deleting) {
    typeEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) { paused = true; setTimeout(type, 100); return; }
    setTimeout(type, 72);
  } else {
    typeEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      setTimeout(type, 320); return;
    }
    setTimeout(type, 36);
  }
}
type();

// ── Scroll reveal ──
const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } }),
  { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ── Mobile menu ──
const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
  const spans = menuToggle.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach((s) => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.querySelectorAll('span').forEach((s) => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    menuToggle.querySelectorAll('span').forEach((s) => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// ── Active nav link on scroll ──
const sections = document.querySelectorAll('section[id]');
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.querySelectorAll('a').forEach((a) => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach((s) => navObserver.observe(s));

// ── Animated number counters ──
const STAT_CONFIGS = [
  { prefix: '₹', value: 60,   suffix: 'Cr+', decimals: 0 },
  { prefix: '',  value: 53,   suffix: '+',   decimals: 0 },
  { prefix: '',  value: 2,    suffix: '',    decimals: 0 },
  { prefix: '',  value: 9.26, suffix: '',    decimals: 2 },
];

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function countUp(el, cfg, duration = 1600) {
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = easeOutCubic(progress);
    const current  = cfg.value * eased;
    el.textContent = cfg.prefix + current.toFixed(cfg.decimals) + cfg.suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = cfg.prefix + cfg.value.toFixed(cfg.decimals) + cfg.suffix;
  }
  requestAnimationFrame(tick);
}

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  let fired = false;
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !fired) {
          fired = true;
          document.querySelectorAll('.stat-num').forEach((el, i) => {
            if (STAT_CONFIGS[i]) countUp(el, STAT_CONFIGS[i]);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  statsObserver.observe(heroStats);
}

// ── Project filter tabs ──
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('[data-cat]');
const projectsGrid = document.getElementById('projectsGrid');

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    projectsGrid.classList.toggle('filtered', filter !== 'all');

    projectCards.forEach((card) => {
      const cats = (card.dataset.cat || '').split(' ');
      const show = filter === 'all' || cats.includes(filter);
      card.style.display = show ? '' : 'none';
      if (show && !card.classList.contains('visible')) card.classList.add('visible');
    });
  });
});

// ── Back to top ──
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Contact form (Formspree / mailto fallback) ──
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn  = contactForm.querySelector('.cf-btn-text');
    const parentBtn  = contactForm.querySelector('.cf-submit');
    const original   = submitBtn.textContent;

    // Mailto fallback while Formspree isn't configured
    if (contactForm.action.includes('YOUR_FORM_ID')) {
      const name    = contactForm.querySelector('[name="name"]').value;
      const email   = contactForm.querySelector('[name="email"]').value;
      const message = contactForm.querySelector('[name="message"]').value;
      const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
      const body    = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
      window.open(`mailto:ronikdedhia@gmail.com?subject=${subject}&body=${body}`);
      submitBtn.textContent = '✓ Opening mail client…';
      contactForm.reset();
      setTimeout(() => { submitBtn.textContent = original; }, 3500);
      return;
    }

    submitBtn.textContent = 'Sending…';
    parentBtn.disabled    = true;

    try {
      const res = await fetch(contactForm.action, {
        method:  'POST',
        body:    new FormData(contactForm),
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        submitBtn.textContent = '✓ Message sent!';
        contactForm.reset();
      } else {
        submitBtn.textContent = 'Failed — email me directly';
      }
    } catch {
      submitBtn.textContent = 'Failed — email me directly';
    }

    parentBtn.disabled = false;
    setTimeout(() => { submitBtn.textContent = original; }, 3500);
  });
}

// ── Custom cursor (mouse/trackpad only) ──
if (window.matchMedia('(pointer: fine)').matches) {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let cursorReady = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Show on first move, starting from correct position
    if (!cursorReady) {
      ringX = mouseX; ringY = mouseY;
      cursorReady = true;
      dot.classList.add('active');
      ring.classList.add('active');
    }

    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth ring lerp via RAF
  function animateRing() {
    ringX += (mouseX - ringX) * 0.13;
    ringY += (mouseY - ringY) * 0.13;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state: enlarge on interactive elements
  const HOVER_SEL = 'a, button, .project-card, .contact-card, .filter-btn, .expertise-card, .highlight-card, .edu-card, .pub-card';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(HOVER_SEL)) {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(HOVER_SEL)) {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
    }
  });

  // Hide when leaving the window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '';
    ring.style.opacity = '';
  });
}

// ── Parallax on hero orbs ──
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const y    = window.scrollY;
      const orb1 = document.querySelector('.orb-1');
      const orb2 = document.querySelector('.orb-2');
      if (orb1) orb1.style.transform = `translateY(${y * 0.18}px)`;
      if (orb2) orb2.style.transform = `translateY(${-y * 0.12}px)`;
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
