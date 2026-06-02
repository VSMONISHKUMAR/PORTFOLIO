// -------------------------------------------------------
    // 1. NAVBAR: scrolled class & active link highlight
    // -------------------------------------------------------
    const navbar    = document.getElementById('navbar');
    const navLinks  = document.querySelectorAll('.nav-links a');
    const allNavLinks = document.querySelectorAll('.nav-links a, #mobileMenu a');
    const sections  = document.querySelectorAll('section[id]');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
      backToTop.classList.toggle('show', window.scrollY > 400);

      let current = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
      });
      allNavLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });
    });

    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // -------------------------------------------------------
    // 2. HAMBURGER MENU (mobile)
    // -------------------------------------------------------
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      mobileMenu.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('menu-open', open);
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
      });
    });

    mobileMenu.setAttribute('aria-hidden', 'true');

    window.addEventListener('resize', () => {
      if (window.innerWidth > 680) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
      }
    });

    // -------------------------------------------------------
    // 3. DARK MODE TOGGLE
    // -------------------------------------------------------
    const darkToggle = document.getElementById('darkToggle');
    const iconSun    = document.getElementById('iconSun');
    const iconMoon   = document.getElementById('iconMoon');
    const root       = document.documentElement;

    function applyTheme(theme) {
      root.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      if (theme === 'dark') {
        iconSun.style.display  = 'block';
        iconMoon.style.display = 'none';
      } else {
        iconSun.style.display  = 'none';
        iconMoon.style.display = 'block';
      }
    }

    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    darkToggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'dark');
    });

    // -------------------------------------------------------
    // 4. SCROLL REVEAL ANIMATION
    // -------------------------------------------------------
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      reveals.forEach(el => el.classList.add('visible'));
    } else {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
      reveals.forEach(el => revealObserver.observe(el));
    }

    // -------------------------------------------------------
    // 5. SKILL BAR ANIMATION
    // -------------------------------------------------------
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill  = entry.target;
          const width = fill.getAttribute('data-width');
          setTimeout(() => { fill.style.width = width + '%'; }, 200);
          barObserver.unobserve(fill);
        }
      });
    }, { threshold: 0.5 });
    skillBars.forEach(bar => barObserver.observe(bar));

    // -------------------------------------------------------
    // 6. CERTIFICATE SLIDESHOW
    // -------------------------------------------------------
    const slideshow = document.getElementById('slideshow');
    const slidePrev = document.getElementById('slidePrev');
    const slideNext = document.getElementById('slideNext');
    const dotsContainer = document.getElementById('slideDots');
    const totalSlides = slideshow.children.length;
    let currentSlide = 0;

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }

    function goToSlide(n) {
      currentSlide = (n + totalSlides) % totalSlides;
      slideshow.style.transform = `translateX(-${currentSlide * 100}%)`;
      document.querySelectorAll('.slide-dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentSlide);
      });
    }

    slidePrev.addEventListener('click', () => goToSlide(currentSlide - 1));
    slideNext.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Auto advance every 4s
    setInterval(() => goToSlide(currentSlide + 1), 4000);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
      if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
    });

    // -------------------------------------------------------
    // 7. CONTACT FORM VALIDATION
    // -------------------------------------------------------
    const form = document.getElementById('contactForm');

    function validateField(groupId, check) {
      const group = document.getElementById(groupId);
      const input = group.querySelector('input, textarea');
      const valid = check(input.value.trim());
      group.classList.toggle('has-error', !valid);
      return valid;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const isNameOk    = validateField('fg-name',    v => v.length >= 2);
      const isEmailOk   = validateField('fg-email',   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      const isSubjectOk = validateField('fg-subject', v => v.length >= 3);
      const isMsgOk     = validateField('fg-message', v => v.length >= 20);

      if (isNameOk && isEmailOk && isSubjectOk && isMsgOk) {
        const success = document.getElementById('formSuccess');
        success.style.display = 'block';
        form.reset();
        setTimeout(() => { success.style.display = 'none'; }, 5000);
      }
    });

    form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.closest('.form-group').classList.remove('has-error');
      });
    });

    // -------------------------------------------------------
    // 8. SMOOTH SCROLL with navbar offset
    // -------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });