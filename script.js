/* ── INITIALIZATION ────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ── CUSTOM CURSOR ─────────────────────────── */
const cur = document.querySelector('.cur');
const curR = document.querySelector('.cur-ring');

document.addEventListener('mousemove', (e) => {
    gsap.to(cur, { x: e.clientX, y: e.clientY, duration: 0 });
    gsap.to(curR, { x: e.clientX, y: e.clientY, duration: 0.15 });
});

document.querySelectorAll('a, button, input, textarea, .stat-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cur.classList.add('hover');
        curR.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        cur.classList.remove('hover');
        curR.classList.remove('hover');
    });
});

/* ── KINETIC FLIGHT PATH (SCROLL LINKED) ───── */
const plane = document.querySelector('.plane-wrap');

// Initial Entrance
gsap.from(plane, {
    x: '-50vw',
    y: '100vh',
    rotation: 20,
    duration: 2.5,
    ease: "power4.out"
});

// Scroll-Linked Flight
gsap.to(plane, {
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
    },
    x: '120vw',
    y: '-20vh',
    rotation: -10,
    scale: 1.5,
    ease: "none"
});

/* ── HERO ANIMATIONS ───────────────────────── */
const heroTl = gsap.timeline();
heroTl.from('h1 span', { y: 100, opacity: 0, stagger: 0.1, duration: 1.2, ease: "power4.out" })
      .from('.hero-p', { opacity: 0, y: 30, duration: 1 }, "-=0.8")
      .from('.hero-tag', { opacity: 0, scale: 0.8, duration: 0.8 }, "-=1");

/* ── STATS COUNTER ─────────────────────────── */
const stats = document.querySelectorAll('.stat-val');
stats.forEach(stat => {
    const target = parseInt(stat.innerText);
    stat.innerText = "0";
    
    ScrollTrigger.create({
        trigger: stat,
        start: "top 90%",
        onEnter: () => {
            let obj = { val: 0 };
            gsap.to(obj, {
                val: target,
                duration: 2,
                ease: "power3.out",
                onUpdate: () => {
                    stat.innerText = Math.ceil(obj.val) + (stat.dataset.suffix || "");
                }
            });
        }
    });
});

/* ── REVEAL ON SCROLL ──────────────────────── */
const reveals = document.querySelectorAll('.reveal');
reveals.forEach(el => {
    ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        onEnter: () => el.classList.add('active')
    });
});

/* ── NAV SCROLL EFFECT ─────────────────────── */
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});
