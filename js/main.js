/* ============================================================
   TO Technologies — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* --- Helpers --- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     HEADER: Scroll shadow + sticky
     ============================================================ */
  function initHeader() {
    const header = $('.header');
    if (!header) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle('header--scrolled', window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     MOBILE MENU
     ============================================================ */
  function initMobileMenu() {
    const toggle = $('.menu-toggle');
    const nav = $('.nav');
    const overlay = $('.mobile-overlay');
    if (!toggle || !nav) return;

    function openMenu() {
      toggle.classList.add('menu-toggle--active');
      nav.classList.add('nav--open');
      if (overlay) overlay.classList.add('mobile-overlay--active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      toggle.classList.remove('menu-toggle--active');
      nav.classList.remove('nav--open');
      if (overlay) overlay.classList.remove('mobile-overlay--active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
      nav.classList.contains('nav--open') ? closeMenu() : openMenu();
    });
    if (overlay) overlay.addEventListener('click', closeMenu);

    // Mobile dropdown toggles
    $$('.nav__dropdown-trigger', nav).forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          trigger.closest('.nav__dropdown').classList.toggle('active');
        }
      });
    });

    // Close on link click
    $$('.nav__link:not(.nav__dropdown-trigger)', nav).forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
    $$('.nav__dropdown-item', nav).forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ============================================================
     SCROLL REVEAL
     ============================================================ */
  function initScrollReveal() {
    if (prefersReducedMotion()) {
      $$('.reveal, .reveal-stagger').forEach((el) => {
        el.classList.add('reveal--visible', 'reveal-stagger--visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(
              entry.target.classList.contains('reveal-stagger')
                ? 'reveal-stagger--visible'
                : 'reveal--visible'
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    $$('.reveal, .reveal-stagger').forEach((el) => observer.observe(el));
  }

  /* ============================================================
     ANIMATED COUNTERS
     ============================================================ */
  function initCounters() {
    const counters = $$('[data-counter]');
    if (!counters.length) return;
    if (prefersReducedMotion()) {
      counters.forEach((el) => {
        el.textContent = el.dataset.counter;
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    counters.forEach((el) => observer.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.counter, 10);
    const duration = 2000;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ============================================================
     SOLUTION BUILDER (Home page interactive selector)
     ============================================================ */
  function initSolutionBuilder() {
    const builder = $('.solution-builder');
    if (!builder) return;

    const tabs = $$('.solution-builder__tab', builder);
    const contents = $$('.solution-builder__content', builder);

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.industry;
        tabs.forEach((t) => t.classList.remove('solution-builder__tab--active'));
        tab.classList.add('solution-builder__tab--active');
        contents.forEach((c) => {
          c.classList.remove('solution-builder__content--active');
          if (c.dataset.industry === target) {
            c.classList.add('solution-builder__content--active');
          }
        });
      });
    });
  }

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  function initFaqAccordion() {
    const items = $$('.faq-item');
    if (!items.length) return;

    items.forEach((item) => {
      const question = $('.faq-question', item);
      const answer = $('.faq-answer', item);
      if (!question || !answer) return;

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('faq-item--open');

        // Close all
        items.forEach((i) => {
          i.classList.remove('faq-item--open');
          const a = $('.faq-answer', i);
          if (a) a.style.maxHeight = '0';
        });

        // Open clicked
        if (!isOpen) {
          item.classList.add('faq-item--open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* ============================================================
     CONTACT FORM (Web3Forms with fallback)
     ============================================================ */
  function initContactForm() {
    const form = $('#contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = $('button[type="submit"]', form);
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      const formData = new FormData(form);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          form.style.display = 'none';
          const success = $('.form-success');
          if (success) success.classList.add('form-success--visible');
        } else {
          throw new Error('Form submission failed');
        }
      } catch {
        // Fallback: mailto
        const name = formData.get('name') || '';
        const company = formData.get('company') || '';
        const message = formData.get('message') || '';
        const subject = encodeURIComponent(
          `Consultation Request from ${name} (${company})`
        );
        const body = encodeURIComponent(message);
        window.location.href = `mailto:info@example.com?subject=${subject}&body=${body}`;
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  /* ============================================================
     NETWORK / DATA-FLOW CANVAS ANIMATION
     ============================================================ */
  function initNetworkAnimation() {
    const canvas = $('.network-visual__canvas');
    if (!canvas || prefersReducedMotion()) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width, height;
    const nodes = [];
    const nodeCount = 30;
    const connectionDistance = 150;
    let animationId;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width * window.devicePixelRatio;
      height = canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function createNodes() {
      nodes.length = 0;
      const w = width / window.devicePixelRatio;
      const h = height / window.devicePixelRatio;
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 3 + 2,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw() {
      const w = width / window.devicePixelRatio;
      const h = height / window.devicePixelRatio;
      ctx.clearRect(0, 0, w, h);

      // Update positions
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            const alpha = 1 - dist / connectionDistance;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha * 0.15})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        const pulse = Math.sin(n.pulse) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${0.4 * pulse})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * pulse * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(8, 145, 178, ${0.08 * pulse})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    }

    // Visibility API: pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        draw();
      }
    });

    resize();
    createNodes();
    draw();
    window.addEventListener('resize', () => {
      cancelAnimationFrame(animationId);
      resize();
      createNodes();
      draw();
    });
  }

  /* ============================================================
     ANIMATED GRADIENT MESH (Hero)
     ============================================================ */
  function initGradientMesh() {
    const mesh = $('.hero__mesh');
    if (!mesh || prefersReducedMotion()) return;

    let time = 0;
    function animate() {
      time += 0.003;
      const x1 = 20 + Math.sin(time) * 15;
      const y1 = 80 + Math.cos(time * 0.7) * 15;
      const x2 = 80 + Math.cos(time * 1.3) * 15;
      const y2 = 20 + Math.sin(time * 0.9) * 15;
      mesh.style.background = `
        radial-gradient(at ${x1}% ${y1}%, rgba(37, 99, 235, 0.12) 0%, transparent 50%),
        radial-gradient(at ${x2}% ${y2}%, rgba(8, 145, 178, 0.12) 0%, transparent 50%),
        radial-gradient(at 50% 50%, rgba(37, 99, 235, 0.04) 0%, transparent 70%)
      `;
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ============================================================
     SMOOTH ANCHOR SCROLLING
     ============================================================ */
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      const headerHeight = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
  }

  /* ============================================================
     ACTIVE NAV LINK
     ============================================================ */
  function initActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    $$('.nav__link, .nav__dropdown-item').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('nav__link--active');
      }
    });
  }

  /* ============================================================
     DASHBOARD CHART ANIMATION
     ============================================================ */
  function initDashboardChart() {
    const bars = $$('.dashboard-chart-bar');
    if (!bars.length || prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            bars.forEach((bar, i) => {
              setTimeout(() => {
                bar.style.transition = 'height 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                bar.style.height = bar.dataset.height || '60%';
              }, i * 80);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    const chart = $('.dashboard-mockup__chart');
    if (chart) observer.observe(chart);
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    initHeader();
    initMobileMenu();
    initScrollReveal();
    initCounters();
    initSolutionBuilder();
    initFaqAccordion();
    initContactForm();
    initNetworkAnimation();
    initGradientMesh();
    initSmoothScroll();
    initActiveNavLink();
    initDashboardChart();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
