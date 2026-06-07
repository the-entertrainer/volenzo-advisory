/* ═══════════════════════════════════════════════════════
   VOLENZO ADVISORY — 22-library motion orchestration
   01 GSAP  02 ScrollTrigger  03 Lenis  04 Splitting  05 SplitType
   06 Typed  07 tsParticles  08 Atropos  09 VanillaTilt  10 Swiper
   11 CountUp  12 Anime  13 Motion  14 RoughNotation  15 Vivus
   16 AOS  17 Rellax  18 ScrollReveal  19 Micron  20 Party
   21 AutoAnimate  22 ProgressBar
   ═══════════════════════════════════════════════════════ */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const has = (name) => typeof window[name] !== 'undefined';

/* ── PRELOADER ─────────────────────────────────────────── */
(function setupPreloader() {
    const loader = document.getElementById('loader');
    if (!loader) { init(); return; }

    const MIN_DURATION = 2800;
    const start = Date.now();
    let domReady = false;
    let timerFired = false;

    function tryExit() {
        if (!domReady || !timerFired) return;
        exitPreloader();
    }

    function exitPreloader() {
        if (has('gsap')) {
            const tl = gsap.timeline({ onComplete: () => { loader.style.display = 'none'; } });
            tl.to('#loader-logo', { scale: 1.06, duration: 0.25, ease: 'power2.out' })
              .to('#loader-logo', { opacity: 0, duration: 0.35, ease: 'power2.in' })
              .to('#loader', { yPercent: -100, duration: 0.65, ease: 'power4.inOut' }, '-=0.1')
              .call(() => {
                  document.body.classList.remove('loading');
                  document.body.style.overflow = '';
                  init();
              });
        } else {
            loader.style.transition = 'opacity 0.4s';
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.classList.remove('loading');
                document.body.style.overflow = '';
                init();
            }, 420);
        }
    }

    const elapsed = Date.now() - start;
    const remaining = Math.max(0, MIN_DURATION - elapsed);
    setTimeout(() => { timerFired = true; tryExit(); }, remaining);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { domReady = true; tryExit(); });
    } else {
        domReady = true;
        tryExit();
    }
})();


function init() {

    /* ── 03. LENIS — smooth momentum scroll (desktop only) ── */
    const isMobile = window.innerWidth < 1024;
    let lenis = null;
    if (has('Lenis') && !reduceMotion && !isMobile) {
        lenis = new Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.6,
        });
        if (has('gsap') && has('ScrollTrigger')) {
            gsap.registerPlugin(ScrollTrigger);
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        } else {
            const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
            requestAnimationFrame(raf);
        }
    } else if (has('gsap') && has('ScrollTrigger')) {
        gsap.registerPlugin(ScrollTrigger);
    }

    const NAV_OFFSET = -72;
    function scrollToTarget(target) {
        const el = document.querySelector(target);
        if (!el) return;
        if (lenis) lenis.scrollTo(el, { offset: NAV_OFFSET, duration: 1.3 });
        else el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }


    /* ── NAVIGATION ──────────────────────────────────── */
    const nav      = document.getElementById('nav');
    const burger   = document.getElementById('nav-burger');
    const overlay  = document.getElementById('mob-overlay');
    const mobClose = document.getElementById('mob-close');

    const onScrollNav = () => nav.classList.toggle('elevated', window.scrollY > 30);
    window.addEventListener('scroll', onScrollNav, { passive: true });
    onScrollNav();

    /* Mobile: hide nav logo while hero is in view; show it after scrolling past */
    if (isMobile) {
        const navLogoLink = document.querySelector('.nav-logo-link');
        const heroSection = document.getElementById('hero');
        if (navLogoLink && heroSection) {
            const heroLogoObs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    navLogoLink.classList.toggle('nav-logo-visible', !entry.isIntersecting);
                });
            }, { threshold: 0.15 });
            heroLogoObs.observe(heroSection);
        }
    }

    function openMenu() {
        burger.classList.add('open');
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        burger.setAttribute('aria-expanded', 'true');
        if (lenis) lenis.stop();
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        burger.classList.remove('open');
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        burger.setAttribute('aria-expanded', 'false');
        if (lenis) lenis.start();
        document.body.style.overflow = '';
    }
    if (burger) burger.addEventListener('click', () => overlay.classList.contains('open') ? closeMenu() : openMenu());
    if (mobClose) mobClose.addEventListener('click', closeMenu);

    document.querySelectorAll('a[data-scroll]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            e.preventDefault();
            if (overlay.classList.contains('open')) closeMenu();
            setTimeout(() => scrollToTarget(href), overlay ? 60 : 0);
        });
    });

    // Scroll-spy
    const navLinks = [...document.querySelectorAll('.nav-links a')];
    const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    if (sections.length) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const id = '#' + entry.target.id;
                navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
        sections.forEach(s => spy.observe(s));
    }


    /* ── SCROLL PROGRESS ─────────────────────────────── */
    const progress = document.getElementById('scroll-progress');
    if (progress && has('gsap') && has('ScrollTrigger')) {
        gsap.to(progress, {
            width: '100%', ease: 'none',
            scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
        });
    } else if (progress) {
        window.addEventListener('scroll', () => {
            const h = document.documentElement;
            progress.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
        }, { passive: true });
    }


    /* ── 04. SPLITTING.js — hero H1 char reveal ────────── */
    const heroH1 = document.querySelector('.hero-h1');
    if (heroH1 && has('Splitting') && !reduceMotion) {
        Splitting({ target: heroH1, by: 'chars' });
        requestAnimationFrame(() => requestAnimationFrame(() => heroH1.classList.add('split-in')));
    } else if (heroH1) {
        heroH1.classList.add('split-in');
    }


    /* ── 05. SplitType — problem title line splits ─────── */
    const problemTitle = document.querySelector('.problem-title');
    if (problemTitle && has('SplitType') && !reduceMotion) {
        const splitProblem = new SplitType(problemTitle, { types: 'lines' });
        splitProblem.lines.forEach((line, i) => {
            line.style.opacity = '0';
            line.style.transform = 'translateY(24px)';
            line.style.transition = `opacity 0.55s ease ${i * 120}ms, transform 0.55s ease ${i * 120}ms`;
        });
        const titleObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                splitProblem.lines.forEach(line => {
                    line.style.opacity = '1';
                    line.style.transform = 'translateY(0)';
                });
                titleObs.unobserve(entry.target);
            });
        }, { threshold: 0.3 });
        titleObs.observe(problemTitle);
    }


    /* ── 06. TYPED.js — rotating pain strings ──────────── */
    const typedEl = document.getElementById('typed-target');
    if (typedEl && has('Typed')) {
        new Typed(typedEl, {
            strings: [
                'unchallenged <strong>ADMs</strong>.',
                'invisible <strong>NDC</strong> inventory.',
                'eroding <strong>GDS</strong> incentives.',
                'fares you never see.',
            ],
            typeSpeed: 42, backSpeed: 22, backDelay: 1800,
            startDelay: 900, loop: true, smartBackspace: true,
        });
    } else if (typedEl) {
        typedEl.innerHTML = 'unchallenged <strong>ADMs</strong>.';
    }


    /* ── 07. tsParticles — light-bg atmosphere ─────────── */
    if (has('tsParticles') && !reduceMotion) {
        tsParticles.load({
            id: 'particles',
            options: {
                fpsLimit: 60,
                fullScreen: { enable: false },
                particles: {
                    number: { value: 32, density: { enable: true, area: 900 } },
                    color: { value: ['rgba(255,255,255,0.8)', '#0055FF', '#E6002D'] },
                    opacity: { value: { min: 0.04, max: 0.10 } },
                    size: { value: { min: 1, max: 2.5 } },
                    move: {
                        enable: true, speed: 0.4, direction: 'top-right',
                        outModes: { default: 'out' }, straight: false,
                    },
                    links: {
                        enable: true, distance: 140,
                        color: 'rgba(255,255,255,0.5)', opacity: 0.06, width: 1,
                    },
                },
                interactivity: {
                    events: { onHover: { enable: true, mode: 'grab' } },
                    modes: { grab: { distance: 160, links: { opacity: 0.18 } } },
                },
                detectRetina: true,
            },
        });
    }


    /* ── 08. ATROPOS — 3D hero plane scene ─────────────── */
    if (has('Atropos') && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
        const heroScene = document.getElementById('hero-atropos');
        if (heroScene) {
            Atropos({
                el: '#hero-atropos',
                activeOffset: 32,
                shadow: false,
                rotateXMax: 8,
                rotateYMax: 11,
                highlight: false,
            });
        }
    }


    /* ── 09. VANILLA-TILT — 3D service cards ───────────── */
    if (has('VanillaTilt') && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
        VanillaTilt.init(document.querySelectorAll('.svc-card[data-tilt]'), {
            scale: 1.02, speed: 600, perspective: 1100,
            glare: true, 'max-glare': 0.08,
        });
    }


    /* ── 10. SWIPER — mobile service cards ─────────────── */
    let swiperInstance = null;
    function initSwiper() {
        const isDesktop = window.innerWidth >= 1024;
        if (!isDesktop && !swiperInstance && has('Swiper')) {
            swiperInstance = new Swiper('.services-swiper', {
                slidesPerView: 1.12,
                centeredSlides: false,
                spaceBetween: 16,
                grabCursor: true,
                pagination: { el: '.swiper-pagination', clickable: true },
                breakpoints: {
                    480: { slidesPerView: 1.3, spaceBetween: 20 },
                    680: { slidesPerView: 2.1, spaceBetween: 24 },
                },
            });
        } else if (isDesktop && swiperInstance) {
            swiperInstance.destroy(true, true);
            swiperInstance = null;
        }
    }
    window.addEventListener('resize', initSwiper, { passive: true });
    initSwiper();


    /* ── 01+02. GSAP + ScrollTrigger — hero parallax ───── */
    if (has('gsap') && has('ScrollTrigger') && !reduceMotion) {
        if (!isMobile) {
            /* Desktop: plane drifts up-right and fades as you scroll past hero */
            gsap.to('.hero-float', {
                y: -180, x: 50, scale: 0.78, opacity: 0.05, ease: 'none',
                scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
            });
            gsap.to('.hero-copy', {
                y: -60, opacity: 0.4, ease: 'none',
                scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
            });
        } else {
            /* Mobile: plane takes off — climbs up-right and banks away as user scrolls */
            const st = { trigger: '#hero', start: 'top top', end: '70% top', scrub: 2 };
            gsap.to('.hero-visual', {
                yPercent: -90, xPercent: 32,
                opacity: 0, ease: 'none',
                scrollTrigger: st,
            });
            /* banking tilt on the float wrapper for the "climbing" look */
            gsap.to('.hero-visual .hero-float', {
                rotate: -10, ease: 'none',
                scrollTrigger: st,
            });
        }
    }


    /* ── 11. COUNTUP.js — animated numbers ─────────────── */
    function runCounter(el) {
        const end    = parseFloat(el.dataset.count);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        if (has('countUp') && !reduceMotion) {
            const c = new countUp.CountUp(el, end, {
                prefix, suffix, duration: 2.4,
                enableScrollSpy: false, useEasing: true,
                decimalPlaces: end % 1 !== 0 ? 1 : 0,
            });
            if (!c.error) { c.start(); return; }
        }
        el.textContent = prefix + end.toLocaleString() + suffix;
    }
    document.querySelectorAll('[data-count]').forEach(el => {
        const obs = new IntersectionObserver((entries, o) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                runCounter(entry.target);
                o.unobserve(entry.target);
            });
        }, { threshold: 0.5 });
        obs.observe(el);
    });


    /* ── 12. ANIME.js — SVG icon stroke draw on hover ───── */
    if (has('anime') && !reduceMotion) {
        document.querySelectorAll('.svc-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                anime({
                    targets: [...card.querySelectorAll('.svc-icon-svg path')],
                    strokeDashoffset: [anime.setDashoffset, 0],
                    easing: 'easeInOutSine',
                    duration: 550,
                    delay: (el, i) => i * 50,
                });
            });
        });
    }


    /* ── 13. MOTION ONE — CTA spring physics ───────────── */
    if (has('Motion') && !reduceMotion) {
        document.querySelectorAll('.btn-primary, .btn-submit, .nav-cta').forEach(btn => {
            btn.addEventListener('mousedown', () => {
                Motion.animate(btn, { scale: 0.95 }, { duration: 0.1, easing: 'ease-out' });
            });
            const release = () => {
                Motion.animate(btn, { scale: 1 }, {
                    easing: Motion.spring({ stiffness: 380, damping: 22, mass: 1 }),
                });
            };
            btn.addEventListener('mouseup', release);
            btn.addEventListener('mouseleave', release);
        });
    }


    /* ── 14. ROUGH NOTATION — hand-drawn ₹25L highlight ── */
    const leakNum = document.getElementById('leak-num');
    if (leakNum && has('RoughNotation') && !reduceMotion) {
        const annotation = RoughNotation.annotate(leakNum, {
            type: 'underline',
            color: '#0055FF',
            strokeWidth: 2.5,
            padding: 3,
            animate: true,
            animationDuration: 700,
        });
        const rnObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                annotation.show();
                rnObs.unobserve(entry.target);
            });
        }, { threshold: 0.6 });
        rnObs.observe(leakNum);
    }


    /* ── 15. VIVUS — row-divider SVG line draw-in ────────── */
    if (has('Vivus') && !reduceMotion) {
        ['div-svg-1', 'div-svg-2'].forEach(id => {
            const svgEl = document.getElementById(id);
            if (!svgEl) return;
            const vivusObs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    new Vivus(id, { type: 'oneByOne', duration: 60, animTimingFunction: Vivus.EASE });
                    vivusObs.unobserve(entry.target);
                });
            }, { threshold: 0.5 });
            vivusObs.observe(svgEl);
        });
    }


    /* ── 16. AOS — declarative scroll reveals ────────────── */
    if (has('AOS')) {
        AOS.init({
            duration: 680, easing: 'ease-out-cubic',
            once: true, offset: 60, disable: reduceMotion,
        });
        if (lenis) lenis.on('scroll', () => AOS.refresh());
        window.addEventListener('load', () => AOS.refresh());
        // Safety net: after 2.5s force-reveal any AOS element that didn't animate
        setTimeout(() => {
            document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach(el => {
                el.classList.add('aos-animate');
            });
        }, 2500);
    }


    /* ── 17. RELLAX — cloud blob parallax ───────────────── */
    if (has('Rellax') && !reduceMotion) {
        new Rellax('.rellax', { center: true, round: true });
    }


    /* ── 18. PROBLEM ROW REVEAL — robust IntersectionObserver ── */
    const problemRows = document.querySelectorAll('.problem-row');
    if (problemRows.length) {
        if (!reduceMotion) {
            problemRows.forEach(row => {
                row.style.opacity = '0';
                row.style.transform = 'translateY(24px)';
            });
            const rowIO = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const delay = [...problemRows].indexOf(entry.target) * 90;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);
                    rowIO.unobserve(entry.target);
                });
            }, { threshold: 0.10, rootMargin: '0px 0px -30px 0px' });
            problemRows.forEach(row => rowIO.observe(row));
        }
        // If reduceMotion: rows are already visible (no CSS hiding)
    }


    /* ── 19. MICRON.js — nav link micro-interactions ────── */
    // Micron auto-activates on data-micron attributes — no explicit init needed.


    /* ── 21. AUTOMATE — form DOM transitions ───────────── */
    const formWrap = document.querySelector('.contact-form-wrap');
    if (formWrap && has('autoAnimate')) {
        autoAnimate(formWrap);
    }


    /* ── 22. PROGRESSBAR.js — animated metric bars ──────── */
    const pbColors = ['#0D0D0D', '#0D0D0D', '#E6002D'];
    [
        { id: 'mbar-1', pct: 0.92 },
        { id: 'mbar-2', pct: 0.72 },
        { id: 'mbar-3', pct: 0.85 },
    ].forEach(({ id, pct }, i) => {
        const host = document.getElementById(id);
        if (!host || !has('ProgressBar')) return;
        const bar = new ProgressBar.Line(host, {
            strokeWidth: 4, trailWidth: 2,
            color: pbColors[i], trailColor: 'rgba(0,0,0,0.08)',
            easing: 'easeInOut', duration: 1800,
        });
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                bar.animate(pct);
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.5 });
        obs.observe(host);
    });

    [
        { id: 'sbar-1', pct: 0.68 },
        { id: 'sbar-2', pct: 0.88 },
        { id: 'sbar-3', pct: 0.56 },
    ].forEach(({ id, pct }) => {
        const host = document.getElementById(id);
        if (!host || !has('ProgressBar')) return;
        const bar = new ProgressBar.Line(host, {
            strokeWidth: 6, trailWidth: 6,
            color: '#0D0D0D', trailColor: '#E4E4E2',
            easing: 'easeInOut', duration: 1600,
        });
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                bar.animate(pct);
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.4 });
        obs.observe(host);
    });


    /* ── CONTACT FORM ─────────────────────────────────── */
    const form      = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    if (form && submitBtn && formWrap) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            submitBtn.disabled = true;

            // 20. Party.js confetti burst
            if (has('party') && !reduceMotion) {
                party.confetti(submitBtn, {
                    count: party.variation.range(60, 100),
                    spread: party.variation.range(50, 80),
                    size: party.variation.range(0.7, 1.2),
                });
            }

            // AutoAnimate (lib 21) transitions this DOM swap smoothly
            setTimeout(() => {
                formWrap.innerHTML = `
                    <div class="form-success-msg">
                        <strong>Message sent.</strong>
                        <p>We&rsquo;ll review your situation and reply within 24&nbsp;hours.</p>
                    </div>`;
            }, 300);
        });
    }


    /* ── REACTIVE LIGHT — cursor-driven glass illumination ── */
    if (!reduceMotion) {
        let lxTarget = 50, lyTarget = 30;
        let lxCur    = 50, lyCur    = 30;
        let lightRaf = null;

        document.addEventListener('mousemove', (e) => {
            lxTarget = (e.clientX / window.innerWidth  * 100);
            lyTarget = (e.clientY / window.innerHeight * 100);
            if (!lightRaf) lightRaf = requestAnimationFrame(tickLight);
        }, { passive: true });

        function tickLight() {
            lxCur += (lxTarget - lxCur) * 0.07;
            lyCur += (lyTarget - lyCur) * 0.07;
            document.documentElement.style.setProperty('--lx', lxCur.toFixed(2));
            document.documentElement.style.setProperty('--ly', lyCur.toFixed(2));
            if (Math.abs(lxTarget - lxCur) > 0.05 || Math.abs(lyTarget - lyCur) > 0.05) {
                lightRaf = requestAnimationFrame(tickLight);
            } else {
                lightRaf = null;
            }
        }

        // Per-card cursor shimmer (card-local coordinates)
        document.querySelectorAll('.svc-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%');
                card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
            }, { passive: true });
            card.addEventListener('mouseleave', () => {
                card.style.setProperty('--mx', '50%');
                card.style.setProperty('--my', '50%');
            });
        });
    }

    /* ── MARQUEE scroll-speed boost ── */
    if (!reduceMotion && !isMobile) {
        const mqTrack = document.querySelector('.marquee-inner');
        if (mqTrack && has('gsap') && has('ScrollTrigger')) {
            ScrollTrigger.create({
                trigger: 'body', start: 0, end: 'max',
                onUpdate: (self) => {
                    const v = Math.min(3, 1 + Math.abs(self.getVelocity() / 2000));
                    gsap.to(mqTrack, { animationPlaybackRate: v, duration: 0.4 });
                },
            });
        }
    }

    /* ── ScrollTrigger refresh on mobile ── */
    setTimeout(() => {
        if (has('ScrollTrigger')) ScrollTrigger.refresh();
    }, 600);

    /* ── Final refresh ────────────────────────────────── */
    window.addEventListener('load', () => {
        if (has('ScrollTrigger')) ScrollTrigger.refresh();
        if (has('AOS')) AOS.refresh();
    });
}
