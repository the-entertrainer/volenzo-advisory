/* ═══════════════════════════════════════════════════════
   VOLENZO ADVISORY — motion orchestration
   10 libraries, each with a distinct, non-conflicting job:
   1 GSAP+ScrollTrigger · 2 Lenis · 3 Splitting · 4 Typed
   5 tsParticles · 6 Atropos · 7 Vanilla-tilt · 8 Rellax
   9 CountUp · 10 AOS
   ═══════════════════════════════════════════════════════ */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const has = (name) => typeof window[name] !== 'undefined';

window.addEventListener('DOMContentLoaded', init);

function init() {

    /* ── 2. LENIS — smooth momentum scroll ───────────── */
    let lenis = null;
    if (has('Lenis') && !reduceMotion) {
        lenis = new Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.6,
        });

        // 1. GSAP ScrollTrigger ↔ Lenis sync
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

    /* Shared smooth-scroll helper (used by nav + buttons) */
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

    // Elevation on scroll
    const onScrollNav = () => nav.classList.toggle('elevated', window.scrollY > 30);
    window.addEventListener('scroll', onScrollNav, { passive: true });
    onScrollNav();

    // Mobile menu
    function openMenu()  { burger.classList.add('open'); overlay.classList.add('open'); overlay.setAttribute('aria-hidden','false'); burger.setAttribute('aria-expanded','true'); if (lenis) lenis.stop(); document.body.style.overflow='hidden'; }
    function closeMenu() { burger.classList.remove('open'); overlay.classList.remove('open'); overlay.setAttribute('aria-hidden','true'); burger.setAttribute('aria-expanded','false'); if (lenis) lenis.start(); document.body.style.overflow=''; }
    burger.addEventListener('click', () => overlay.classList.contains('open') ? closeMenu() : openMenu());
    mobClose.addEventListener('click', closeMenu);

    // Intercept every in-page anchor for offset-aware smooth scroll
    document.querySelectorAll('a[data-scroll]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            e.preventDefault();
            if (overlay.classList.contains('open')) closeMenu();
            // wait a tick so the overlay releases scroll-lock before scrolling
            setTimeout(() => scrollToTarget(href), overlay ? 60 : 0);
        });
    });

    // Scroll-spy — highlight the active nav link
    const navLinks = [...document.querySelectorAll('.nav-links a')];
    const sections = navLinks
        .map(a => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);
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


    /* ── SCROLL PROGRESS BAR (GSAP) ──────────────────── */
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


    /* ── 3. SPLITTING.js — headline char reveal ──────── */
    const h1 = document.querySelector('.hero-h1');
    if (h1 && has('Splitting') && !reduceMotion) {
        Splitting({ target: h1, by: 'chars' });
        requestAnimationFrame(() => requestAnimationFrame(() => h1.classList.add('split-in')));
    } else if (h1) {
        h1.classList.add('split-in');
    }


    /* ── 4. TYPED.js — rotating pain points ──────────── */
    const typedEl = document.getElementById('typed-pain');
    if (typedEl && has('Typed')) {
        new Typed(typedEl, {
            strings: [
                'unchallenged <strong>ADMs</strong>.',
                'invisible <strong>NDC</strong> inventory.',
                'eroding <strong>GDS</strong> incentives.',
                'fares you never see.',
            ],
            typeSpeed: 45, backSpeed: 24, backDelay: 1700,
            startDelay: 1100, loop: true, smartBackspace: true,
        });
    } else if (typedEl) {
        typedEl.innerHTML = 'unchallenged <strong>ADMs</strong>.';
    }


    /* ── 5. tsParticles — atmospheric sky ────────────── */
    if (has('tsParticles') && !reduceMotion) {
        tsParticles.load({
            id: 'particles',
            options: {
                fpsLimit: 60,
                fullScreen: { enable: false },
                particles: {
                    number: { value: 38, density: { enable: true, area: 900 } },
                    color: { value: ['#0052CC', '#1D6AE8', '#FFFFFF'] },
                    opacity: { value: { min: 0.08, max: 0.35 } },
                    size: { value: { min: 1, max: 3.5 } },
                    move: {
                        enable: true, speed: 0.5, direction: 'top-right',
                        outModes: { default: 'out' }, straight: false,
                    },
                    links: {
                        enable: true, distance: 140,
                        color: '#1D6AE8', opacity: 0.12, width: 1,
                    },
                },
                interactivity: {
                    events: { onHover: { enable: true, mode: 'grab' } },
                    modes: { grab: { distance: 160, links: { opacity: 0.25 } } },
                },
                detectRetina: true,
            },
        });
    }


    /* ── 6. ATROPOS — 3D parallax scenes ─────────────── */
    if (has('Atropos') && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
        const heroScene = document.getElementById('hero-atropos');
        if (heroScene) Atropos({ el: '#hero-atropos', activeOffset: 36, shadow: false, rotateXMax: 9, rotateYMax: 12 });
        const whyScene = document.getElementById('why-atropos');
        if (whyScene) Atropos({ el: '#why-atropos', activeOffset: 24, shadow: false, rotateXMax: 7, rotateYMax: 9 });
    }


    /* ── 7. VANILLA-TILT — 3D service cards ──────────── */
    if (has('VanillaTilt') && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
        VanillaTilt.init(document.querySelectorAll('.svc-card[data-tilt]'), {
            scale: 1.02, speed: 600, perspective: 1200,
        });
    }


    /* ── 8. RELLAX — multi-speed cloud parallax ──────── */
    if (has('Rellax') && !reduceMotion) {
        new Rellax('.rellax', { center: true, round: true });
    }


    /* ── 1. GSAP — hero parallax on scroll ──────────────
       Ownership is strictly separated to avoid transform fights:
         .hero-float → GSAP  (scroll-driven fly-away, outside Atropos)
         #hero-atropos children with data-atropos-offset → Atropos only
         .hero-plane → CSS planeBob (Atropos overrides on hover; CSS runs otherwise)
    ── */
    if (has('gsap') && has('ScrollTrigger') && !reduceMotion) {
        // The whole 3D scene drifts up and away as the user scrolls past the hero.
        // .hero-float is the parent of #hero-atropos, so moving it shifts everything
        // inside without touching any element Atropos owns.
        gsap.to('.hero-float', {
            y: -160, x: 60, scale: 0.84, opacity: 0.1, ease: 'none',
            scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
        });
        // Hero copy drifts up at a slightly different speed (parallax depth)
        gsap.to('.hero-copy', {
            y: -50, opacity: 0.45, ease: 'none',
            scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
        });
    }


    /* ── 9. COUNTUP.js — animated numbers ────────────── */
    function runCounter(el) {
        const end    = parseFloat(el.dataset.count);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        if (has('countUp') && !reduceMotion) {
            const c = new countUp.CountUp(el, end, {
                prefix, suffix, duration: 2.2,
                enableScrollSpy: false, useEasing: true,
            });
            if (!c.error) { c.start(); return; }
        }
        el.textContent = prefix + end.toLocaleString() + suffix;
    }
    document.querySelectorAll('[data-count], .stat-num[data-count], .trust-num[data-count]').forEach(el => {
        const seen = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                runCounter(entry.target);
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.4 });
        seen.observe(el);
    });


    /* ── 10. AOS — declarative scroll reveals ────────── */
    if (has('AOS')) {
        AOS.init({
            duration: 700, easing: 'ease-out-cubic',
            once: true, offset: 60, disable: reduceMotion,
        });
        // Re-sync AOS to Lenis-driven scroll
        if (lenis) lenis.on('scroll', () => AOS.refresh());
        window.addEventListener('load', () => AOS.refresh());
    }


    /* ── CONTACT FORM ────────────────────────────────── */
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    if (form && submitBtn) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const label = submitBtn.querySelector('.btn-label');
            const orig = label.textContent;
            submitBtn.disabled = true;
            label.textContent = "Sent — we'll reply within 24 hours";
            form.reset();
            setTimeout(() => { label.textContent = orig; submitBtn.disabled = false; }, 6000);
        });
    }

    // Final refresh once everything is laid out
    window.addEventListener('load', () => {
        if (has('ScrollTrigger')) ScrollTrigger.refresh();
    });
}
