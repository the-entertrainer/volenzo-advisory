/* ═══════════════════════════════════════════════════════
   VOLENZO ADVISORY — Vite/npm build
   22 libraries + Bloomberg Terminal canvas
   ═══════════════════════════════════════════════════════ */

// ─── Styles ────────────────────────────────────────────────
import './style.css';
import 'lenis/dist/lenis.css';
import 'splitting/dist/splitting.css';
import 'swiper/swiper-bundle.css';
import 'aos/dist/aos.css';

// ─── Core animation ────────────────────────────────────────
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ─── Scroll / split ────────────────────────────────────────
import Lenis from 'lenis';
import Splitting from 'splitting';
import SplitType from 'split-type';

// ─── Hero ──────────────────────────────────────────────────
import Typed from 'typed.js';
import Atropos from 'atropos';

// ─── Cards ─────────────────────────────────────────────────
import VanillaTilt from 'vanilla-tilt';
import Swiper from 'swiper/bundle';
import anime from 'animejs';

// ─── Numbers / annotations ─────────────────────────────────
import { CountUp } from 'countup.js';
import { annotate } from 'rough-notation';
import ProgressBar from 'progressbar.js';

// ─── Motion / micro ────────────────────────────────────────
import { animate as motionAnimate, spring } from 'motion';
import Vivus from 'vivus';
import AOS from 'aos';
import Rellax from 'rellax';
import ScrollReveal from 'scrollreveal';

// ─── Effects ───────────────────────────────────────────────
import party from 'party-js';
import autoAnimate from '@formkit/auto-animate';

// ─── tsParticles (async slim bundle) ───────────────────────
import { tsParticles } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

// ─── Bloomberg Terminal ────────────────────────────────────
import { initTerminal } from './terminal.js';

// ─── Micron (side-effect: auto-activates on data-micron) ───
import 'webkul-micron/dist/script/micron.min.js';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── PRELOADER ─────────────────────────────────────────── */
(function setupPreloader() {
    const loader = document.getElementById('loader');
    if (!loader) { init(); return; }

    const MIN_DURATION = 2800;
    const start = Date.now();
    let domReady  = false;
    let timerFired = false;

    function tryExit() {
        if (!domReady || !timerFired) return;
        exitPreloader();
    }

    function exitPreloader() {
        const tl = gsap.timeline({ onComplete: () => { loader.style.display = 'none'; } });
        tl.to('#loader-logo', { scale: 1.06, duration: 0.25, ease: 'power2.out' })
          .to('#loader-logo', { opacity: 0,   duration: 0.35, ease: 'power2.in' })
          .to('#loader',      { yPercent: -100, duration: 0.65, ease: 'power4.inOut' }, '-=0.1')
          .call(() => {
              document.body.classList.remove('loading');
              document.body.style.overflow = '';
              init();
          });
    }

    const elapsed   = Date.now() - start;
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

    /* ── Bloomberg Terminal ─────────────────────────────── */
    if (!reduceMotion) initTerminal();

    /* ── tsParticles (async) ────────────────────────────── */
    if (!reduceMotion) {
        loadSlim(tsParticles).then(() => {
            tsParticles.load({
                id: 'particles',
                options: {
                    fpsLimit: 60,
                    fullScreen: { enable: false },
                    particles: {
                        number: { value: 22, density: { enable: true, area: 900 } },
                        color: { value: ['#0055FF', '#1A3A6B'] },
                        opacity: { value: { min: 0.04, max: 0.12 } },
                        size:    { value: { min: 1, max: 2 } },
                        move:    { enable: true, speed: 0.3, direction: 'top-right', outModes: { default: 'out' } },
                        links:   { enable: true, distance: 140, color: '#1A3A6B', opacity: 0.06, width: 1 },
                    },
                    interactivity: {
                        events: { onHover: { enable: true, mode: 'grab' } },
                        modes:  { grab: { distance: 160, links: { opacity: 0.14 } } },
                    },
                    detectRetina: true,
                },
            });
        });
    }

    /* ── Lenis smooth scroll ────────────────────────────── */
    const isMobile = window.innerWidth < 1024;
    let lenis = null;
    if (!reduceMotion && !isMobile) {
        lenis = new Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    }

    const NAV_OFFSET = -72;
    function scrollToTarget(target) {
        const el = document.querySelector(target);
        if (!el) return;
        if (lenis) lenis.scrollTo(el, { offset: NAV_OFFSET, duration: 1.3 });
        else el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }

    /* ── Navigation ─────────────────────────────────────── */
    const nav      = document.getElementById('nav');
    const burger   = document.getElementById('nav-burger');
    const overlay  = document.getElementById('mob-overlay');
    const mobClose = document.getElementById('mob-close');

    const onScrollNav = () => nav.classList.toggle('elevated', window.scrollY > 30);
    window.addEventListener('scroll', onScrollNav, { passive: true });
    onScrollNav();

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

    /* ── Scroll progress bar ────────────────────────────── */
    const progress = document.getElementById('scroll-progress');
    if (progress) {
        gsap.to(progress, {
            width: '100%', ease: 'none',
            scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
        });
    }

    /* ── Splitting.js — hero H1 char reveal ─────────────── */
    const heroH1 = document.querySelector('.hero-h1');
    if (heroH1 && !reduceMotion) {
        Splitting({ target: heroH1, by: 'chars' });
        requestAnimationFrame(() => requestAnimationFrame(() => heroH1.classList.add('split-in')));
    } else if (heroH1) {
        heroH1.classList.add('split-in');
    }

    /* ── SplitType — problem title ───────────────────────── */
    const problemTitle = document.querySelector('.problem-title');
    if (problemTitle && !reduceMotion) {
        const st = new SplitType(problemTitle, { types: 'lines' });
        st.lines.forEach((line, i) => {
            line.style.opacity = '0';
            line.style.transform = 'translateY(24px)';
            line.style.transition = `opacity 0.55s ease ${i * 120}ms, transform 0.55s ease ${i * 120}ms`;
        });
        new IntersectionObserver((entries, o) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                st.lines.forEach(l => { l.style.opacity = '1'; l.style.transform = 'translateY(0)'; });
                o.unobserve(entry.target);
            });
        }, { threshold: 0.3 }).observe(problemTitle);
    }

    /* ── Typed.js ────────────────────────────────────────── */
    const typedEl = document.getElementById('typed-target');
    if (typedEl) {
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

    /* ── Atropos 3D hero ─────────────────────────────────── */
    if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
        const heroScene = document.getElementById('hero-atropos');
        if (heroScene) {
            Atropos({
                el: '#hero-atropos',
                activeOffset: 32, shadow: false,
                rotateXMax: 8, rotateYMax: 11, highlight: false,
            });
        }
    }

    /* ── Vanilla Tilt ────────────────────────────────────── */
    if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
        VanillaTilt.init(document.querySelectorAll('.svc-card[data-tilt]'), {
            scale: 1.02, speed: 600, perspective: 1100,
            glare: true, 'max-glare': 0.08,
        });
    }

    /* ── Swiper mobile cards ─────────────────────────────── */
    let swiperInstance = null;
    function initSwiper() {
        const isDesktop = window.innerWidth >= 1024;
        if (!isDesktop && !swiperInstance) {
            swiperInstance = new Swiper('.services-swiper', {
                slidesPerView: 1.12, spaceBetween: 16, grabCursor: true,
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

    /* ── GSAP ScrollTrigger — hero parallax ──────────────── */
    if (!reduceMotion) {
        if (!isMobile) {
            gsap.to('.hero-float', {
                y: -180, x: 50, scale: 0.78, opacity: 0.05, ease: 'none',
                scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
            });
            gsap.to('.hero-copy', {
                y: -60, opacity: 0.4, ease: 'none',
                scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
            });
        } else {
            const st = { trigger: '#hero', start: 'top top', end: '70% top', scrub: 2 };
            gsap.to('.hero-visual', { yPercent: -90, xPercent: 32, opacity: 0, ease: 'none', scrollTrigger: st });
            gsap.to('.hero-visual .hero-float', { rotate: -10, ease: 'none', scrollTrigger: st });
        }
    }

    /* ── CountUp ─────────────────────────────────────────── */
    function runCounter(el) {
        const end    = parseFloat(el.dataset.count);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        if (!reduceMotion) {
            const c = new CountUp(el, end, {
                prefix, suffix, duration: 2.4,
                enableScrollSpy: false, useEasing: true,
                decimalPlaces: end % 1 !== 0 ? 1 : 0,
            });
            if (!c.error) { c.start(); return; }
        }
        el.textContent = prefix + end.toLocaleString() + suffix;
    }
    document.querySelectorAll('[data-count]').forEach(el => {
        new IntersectionObserver((entries, o) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                runCounter(entry.target);
                o.unobserve(entry.target);
            });
        }, { threshold: 0.5 }).observe(el);
    });

    /* ── Anime.js — SVG icon draw ────────────────────────── */
    if (!reduceMotion) {
        document.querySelectorAll('.svc-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                anime({
                    targets: [...card.querySelectorAll('.svc-icon-svg path, .svc-icon-svg circle')],
                    strokeDashoffset: [anime.setDashoffset, 0],
                    easing: 'easeInOutSine', duration: 550,
                    delay: (el, i) => i * 50,
                });
            });
        });
    }

    /* ── Motion One — CTA spring ─────────────────────────── */
    if (!reduceMotion) {
        document.querySelectorAll('.btn-primary, .btn-submit, .nav-cta').forEach(btn => {
            btn.addEventListener('mousedown', () => motionAnimate(btn, { scale: 0.95 }, { duration: 0.1 }));
            const release = () => motionAnimate(btn, { scale: 1 }, { easing: spring({ stiffness: 380, damping: 22 }) });
            btn.addEventListener('mouseup', release);
            btn.addEventListener('mouseleave', release);
        });
    }

    /* ── Rough Notation ─────────────────────────────────── */
    const leakNum = document.getElementById('leak-num');
    if (leakNum && !reduceMotion) {
        const ann = annotate(leakNum, { type: 'underline', color: '#0055FF', strokeWidth: 2.5, padding: 3, animate: true, animationDuration: 700 });
        new IntersectionObserver((entries, o) => {
            entries.forEach(entry => { if (!entry.isIntersecting) return; ann.show(); o.unobserve(entry.target); });
        }, { threshold: 0.6 }).observe(leakNum);
    }

    /* ── Vivus — SVG line draw-in ────────────────────────── */
    if (!reduceMotion) {
        ['div-svg-1', 'div-svg-2'].forEach(id => {
            const svgEl = document.getElementById(id);
            if (!svgEl) return;
            new IntersectionObserver((entries, o) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    new Vivus(id, { type: 'oneByOne', duration: 60, animTimingFunction: Vivus.EASE });
                    o.unobserve(entry.target);
                });
            }, { threshold: 0.5 }).observe(svgEl);
        });
    }

    /* ── AOS ────────────────────────────────────────────── */
    AOS.init({ duration: 680, easing: 'ease-out-cubic', once: true, offset: 60, disable: reduceMotion });
    if (lenis) lenis.on('scroll', () => AOS.refresh());
    window.addEventListener('load', () => AOS.refresh());
    setTimeout(() => {
        document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach(el => el.classList.add('aos-animate'));
    }, 2500);

    /* ── Rellax ─────────────────────────────────────────── */
    if (!reduceMotion) new Rellax('.rellax', { center: true, round: true });

    /* ── Problem row reveals ─────────────────────────────── */
    const problemRows = document.querySelectorAll('.problem-row');
    if (problemRows.length && !reduceMotion) {
        problemRows.forEach(row => {
            row.style.opacity = '0';
            row.style.transform = 'translateY(24px)';
        });
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const delay = [...problemRows].indexOf(entry.target) * 90;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
            });
        }, { threshold: 0.10, rootMargin: '0px 0px -30px 0px' }).observe;
        // Individual observers per row
        problemRows.forEach(row => {
            new IntersectionObserver((entries, o) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const delay = [...problemRows].indexOf(entry.target) * 90;
                    setTimeout(() => { entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0)'; }, delay);
                    o.unobserve(entry.target);
                });
            }, { threshold: 0.10 }).observe(row);
        });
    }

    /* ── AutoAnimate form ─────────────────────────────────── */
    const formWrap = document.querySelector('.contact-form-wrap');
    if (formWrap) autoAnimate(formWrap);

    /* ── ProgressBar — metric bars ───────────────────────── */
    const pbColors = ['#1A3A6B', '#0055FF', '#D41C2C'];
    [{ id: 'mbar-1', pct: 0.92 }, { id: 'mbar-2', pct: 0.72 }, { id: 'mbar-3', pct: 0.85 }].forEach(({ id, pct }, i) => {
        const host = document.getElementById(id);
        if (!host) return;
        const bar = new ProgressBar.Line(host, {
            strokeWidth: 4, trailWidth: 2,
            color: pbColors[i], trailColor: 'rgba(0,55,180,0.10)',
            easing: 'easeInOut', duration: 1800,
        });
        new IntersectionObserver((entries, o) => {
            entries.forEach(entry => { if (!entry.isIntersecting) return; bar.animate(pct); o.unobserve(entry.target); });
        }, { threshold: 0.5 }).observe(host);
    });

    [{ id: 'sbar-1', pct: 0.68 }, { id: 'sbar-2', pct: 0.88 }, { id: 'sbar-3', pct: 0.56 }].forEach(({ id, pct }) => {
        const host = document.getElementById(id);
        if (!host) return;
        const bar = new ProgressBar.Line(host, {
            strokeWidth: 6, trailWidth: 6,
            color: '#0055FF', trailColor: 'rgba(0,55,180,0.12)',
            easing: 'easeInOut', duration: 1600,
        });
        new IntersectionObserver((entries, o) => {
            entries.forEach(entry => { if (!entry.isIntersecting) return; bar.animate(pct); o.unobserve(entry.target); });
        }, { threshold: 0.4 }).observe(host);
    });

    /* ── Contact form ────────────────────────────────────── */
    const form      = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    if (form && submitBtn && formWrap) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            if (!reduceMotion) {
                party.confetti(submitBtn, {
                    count: party.variation.range(60, 100),
                    spread: party.variation.range(50, 80),
                    size: party.variation.range(0.7, 1.2),
                });
            }
            setTimeout(() => {
                formWrap.innerHTML = `<div class="form-success-msg"><strong>Message sent.</strong><p>We'll review your situation and reply within 24 hours.</p></div>`;
            }, 300);
        });
    }

    /* ── Reactive cursor light ───────────────────────────── */
    if (!reduceMotion) {
        let lxT = 50, lyT = 30, lxC = 50, lyC = 30, lightRaf = null;
        document.addEventListener('mousemove', (e) => {
            lxT = e.clientX / window.innerWidth * 100;
            lyT = e.clientY / window.innerHeight * 100;
            if (!lightRaf) lightRaf = requestAnimationFrame(function tick() {
                lxC += (lxT - lxC) * 0.07;
                lyC += (lyT - lyC) * 0.07;
                document.documentElement.style.setProperty('--lx', lxC.toFixed(2));
                document.documentElement.style.setProperty('--ly', lyC.toFixed(2));
                lightRaf = (Math.abs(lxT - lxC) > 0.05 || Math.abs(lyT - lyC) > 0.05) ? requestAnimationFrame(tick) : null;
            });
        }, { passive: true });
        document.querySelectorAll('.svc-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
                card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
            }, { passive: true });
            card.addEventListener('mouseleave', () => { card.style.setProperty('--mx','50%'); card.style.setProperty('--my','50%'); });
        });
    }

    /* ── Marquee speed-boost on scroll ──────────────────── */
    if (!reduceMotion && !isMobile) {
        const mqTrack = document.querySelector('.marquee-inner');
        if (mqTrack) {
            ScrollTrigger.create({
                trigger: 'body', start: 0, end: 'max',
                onUpdate: (self) => {
                    const v = Math.min(3, 1 + Math.abs(self.getVelocity() / 2000));
                    gsap.to(mqTrack, { animationPlaybackRate: v, duration: 0.4 });
                },
            });
        }
    }

    /* ── Final refresh ───────────────────────────────────── */
    setTimeout(() => ScrollTrigger.refresh(), 600);
    window.addEventListener('load', () => { ScrollTrigger.refresh(); AOS.refresh(); });
}
