/* ═══════════════════════════════════════════════════════
   VOLENZO ADVISORY — Plane physics, sky, interactions
   ═══════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────
   1. MOBILE MENU
────────────────────────────────────────────────────── */
const burger     = document.getElementById('nav-burger');
const overlay    = document.getElementById('mob-overlay');
const mobClose   = document.getElementById('mob-close');
const mobLinks   = overlay.querySelectorAll('a');

function openMenu()  { burger.classList.add('open'); overlay.classList.add('open'); overlay.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
function closeMenu() { burger.classList.remove('open'); overlay.classList.remove('open'); overlay.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }

burger.addEventListener('click', openMenu);
mobClose.addEventListener('click', closeMenu);
mobLinks.forEach(l => l.addEventListener('click', closeMenu));

/* ──────────────────────────────────────────────────────
   2. NAV ELEVATION
────────────────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('elevated', window.scrollY > 40);
}, { passive: true });

/* ──────────────────────────────────────────────────────
   3. PLANE — physics-based scroll flight
────────────────────────────────────────────────────── */
const flightWrapper = document.getElementById('flight-wrapper');
const planeImg      = document.getElementById('flight-plane');
const canvas        = document.getElementById('contrail-canvas');
const ctx           = canvas.getContext('2d');

// Resize canvas to viewport
function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

// Flight keyframes: [scrollProgress (0–1), x (vw), y (vh), rot (deg), rotateY (deg), scale]
// Plane starts bottom-right in hero, climbs across sky, exits upper-left
const KEYFRAMES = [
    [0.00,  58,  54,  -5,   8,  1.00],
    [0.08,  54,  46,  -9,  14,  1.04],
    [0.16,  48,  36,  -14, 22,  1.08],   // banking into climb
    [0.26,  40,  26,  -19, 29,  1.10],   // hardest bank + climb
    [0.36,  30,  18,  -15, 22,  1.05],   // easing through the turn
    [0.46,  20,  13,  -10, 12,  0.98],   // leveling off
    [0.58,  12,   9,   -6,  5,  0.88],   // cruising, ascending away
    [0.72,   4,   5,   -4,  0,  0.76],   // receding into distance
    [0.88,  -4,   3,   -2, -5,  0.63],   // departing
    [1.00, -12,   1,   -1, -8,  0.50],   // gone
];

// Smooth lerp between keyframes
function lerp(a, b, t) { return a + (b - a) * t; }

function getFlightState(progress) {
    let i = 0;
    while (i < KEYFRAMES.length - 2 && KEYFRAMES[i + 1][0] <= progress) i++;

    const kfA = KEYFRAMES[i];
    const kfB = KEYFRAMES[i + 1];
    const range = kfB[0] - kfA[0];
    const t = range === 0 ? 0 : (progress - kfA[0]) / range;

    // Ease within segment for more natural feel
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    return {
        x:       lerp(kfA[1], kfB[1], eased),
        y:       lerp(kfA[2], kfB[2], eased),
        rot:     lerp(kfA[3], kfB[3], eased),
        rotateY: lerp(kfA[4], kfB[4], eased),
        scale:   lerp(kfA[5], kfB[5], eased),
    };
}

// Contrail: store recent centre positions
const contrailPoints = [];
const CONTRAIL_MAX   = 80;

// Current rendered plane centre (screen coords) — updated every frame
let planeCentreX = 0;
let planeCentreY = 0;

// Apply flight state
function applyFlight(progress) {
    const state = getFlightState(Math.max(0, Math.min(1, progress)));
    const vw = window.innerWidth  / 100;
    const vh = window.innerHeight / 100;

    const targetX = state.x * vw;
    const targetY = state.y * vh;

    gsap.set(flightWrapper, {
        x: targetX,
        y: targetY,
        rotation:  state.rot,
        rotateY:   state.rotateY,
        scale:     state.scale,
        transformPerspective: 900,
        transformOrigin: 'center center',
    });

    // Track centre for contrail
    const rect = flightWrapper.getBoundingClientRect();
    planeCentreX = rect.left + rect.width  / 2;
    planeCentreY = rect.top  + rect.height / 2;
}

// GSAP ticker draws contrail every frame
function drawContrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (contrailPoints.length < 3) return;

    // Two parallel trails (like twin engine exhaust)
    [-8, 8].forEach(offset => {
        ctx.beginPath();
        ctx.moveTo(contrailPoints[0].x + offset, contrailPoints[0].y);

        for (let i = 1; i < contrailPoints.length; i++) {
            // Smooth with quadratic curves
            const mid = {
                x: (contrailPoints[i - 1].x + contrailPoints[i].x) / 2 + offset,
                y: (contrailPoints[i - 1].y + contrailPoints[i].y) / 2,
            };
            ctx.quadraticCurveTo(contrailPoints[i - 1].x + offset, contrailPoints[i - 1].y, mid.x, mid.y);
        }

        // Gradient along path
        const oldest = contrailPoints[0];
        const newest = contrailPoints[contrailPoints.length - 1];
        const grad = ctx.createLinearGradient(oldest.x, oldest.y, newest.x, newest.y);
        grad.addColorStop(0,   'rgba(255,255,255,0)');
        grad.addColorStop(0.4, 'rgba(255,255,255,0.12)');
        grad.addColorStop(0.8, 'rgba(255,255,255,0.32)');
        grad.addColorStop(1,   'rgba(255,255,255,0.5)');

        ctx.strokeStyle  = grad;
        ctx.lineWidth    = 3;
        ctx.lineCap      = 'round';
        ctx.lineJoin     = 'round';
        ctx.stroke();
    });
}

// Record plane position for contrail
let lastSampleTime = 0;
gsap.ticker.add((time) => {
    // Sample every ~16ms
    if (time - lastSampleTime > 16) {
        if (planeCentreX > 0 || planeCentreY > 0) {
            contrailPoints.push({ x: planeCentreX, y: planeCentreY });
            if (contrailPoints.length > CONTRAIL_MAX) contrailPoints.shift();
        }
        lastSampleTime = time;
    }
    drawContrail();
});

// Scroll-linked flight
ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    scrub: false,          // manual update for custom easing
    onUpdate: (self) => {
        applyFlight(self.progress);
    },
});

// Set initial position (before any scroll)
applyFlight(0);

// Floating micro-animation on plane in hero (before user scrolls)
const floatTl = gsap.timeline({ repeat: -1, yoyo: true });
floatTl.to(flightWrapper, {
    y: '+=12', rotation: '-=1.5', duration: 3.2,
    ease: 'sine.inOut',
});

// Pause float animation when scrolling (resume on idle)
let scrollTimer = null;
window.addEventListener('scroll', () => {
    floatTl.pause();
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
        if (window.scrollY < window.innerHeight * 0.15) floatTl.play();
    }, 800);
}, { passive: true });

// Cloud parallax (slower than scroll for depth illusion)
const cloudA = document.querySelector('.sky-cloud--a');
const cloudB = document.querySelector('.sky-cloud--b');
const cloudC = document.querySelector('.sky-cloud--c');

if (cloudA) {
    ScrollTrigger.create({
        start: 'top top', end: 'bottom bottom',
        onUpdate: (self) => {
            const p = self.progress;
            gsap.set(cloudA, { x: p * -80, y: p * -60 });
            gsap.set(cloudB, { x: p *  40, y: p * -90 });
            gsap.set(cloudC, { x: p * -30, y: p * -70 });
        }
    });
}

/* ──────────────────────────────────────────────────────
   4. STAT COUNTERS
────────────────────────────────────────────────────── */
document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';

    ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter() {
            const counter = { v: 0 };
            gsap.to(counter, {
                v: target, duration: 2.4, ease: 'power3.out',
                onUpdate() { el.textContent = Math.ceil(counter.v).toLocaleString() + suffix; },
            });
        },
    });
});

/* ──────────────────────────────────────────────────────
   5. SCROLL REVEALS
────────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ──────────────────────────────────────────────────────
   6. CONTACT FORM
────────────────────────────────────────────────────── */
const form      = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

if (form && submitBtn) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const label = submitBtn.querySelector('.btn-label');
        const orig  = label.textContent;

        submitBtn.disabled = true;
        label.textContent  = 'Message sent — we\'ll respond within 24 hours';
        form.reset();

        setTimeout(() => {
            label.textContent  = orig;
            submitBtn.disabled = false;
        }, 6000);
    });
}
