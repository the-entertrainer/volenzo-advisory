/* ═══════════════════════════════════════════════
   VOLENZO ADVISORY — Interactions
   ═══════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

// ── Navigation scroll effect ────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── Plane parallax animation ────────────────────
const plane = document.getElementById('plane');
if (plane) {
    gsap.to(plane, {
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
            markers: false,
        },
        y: -300,
        x: 200,
        rotation: 15,
        opacity: 0.4,
        ease: 'none',
    });
}

// ── Stat counters ──────────────────────────────
document.querySelectorAll('.stat-number[data-value]').forEach(el => {
    const target = parseInt(el.dataset.value, 10);

    ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
            const counter = { value: 0 };
            gsap.to(counter, {
                value: target,
                duration: 2,
                ease: 'power2.out',
                onUpdate() {
                    el.textContent = Math.ceil(counter.value).toLocaleString();
                },
            });
        },
    });
});

// ── Form submission ────────────────────────────
const form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.btn-submit');
        const label = btn.textContent;

        btn.textContent = '✓ Message sent';
        btn.disabled = true;
        form.reset();

        setTimeout(() => {
            btn.textContent = label;
            btn.disabled = false;
        }, 4000);
    });
}

// ── Scroll-reveal animations ───────────────────
const revealElements = document.querySelectorAll(
    '.stat-box, .solution-card, .service-card, .problem-item'
);

revealElements.forEach((el, i) => {
    gsap.set(el, { opacity: 0, y: 40 });

    ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => {
            gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                delay: i * 0.1,
            });
        },
    });
});
