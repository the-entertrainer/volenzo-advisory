// terminal.js — Floating financial data cards with live updates and 3D parallax

import { gsap } from 'gsap';

const CARDS = [
    {
        label: 'ADM RAISED',
        value: 8.4,  range: [3.2, 14.5], dec: 1,
        prefix: '-₹', suffix: 'L',
        meta: '6E-2847 · BOM-DEL',
        status: 'PENDING', type: 'danger',
        pos: { left: '7%', top: '15%' },
        tz: 28, rx: 4, ry: -8,
        dur: 6.2, del: 0, interval: 4200,
    },
    {
        label: 'FARE MISSED',
        value: 1240, range: [820, 2100], dec: 0,
        prefix: '₹', suffix: '/pax',
        meta: 'NDC vs GDS · 6E',
        status: 'NDC ONLY', type: 'warning',
        pos: { right: '5%', top: '10%' },
        tz: -22, rx: -3, ry: 10,
        dur: 7.8, del: 1.2, interval: 3600,
    },
    {
        label: 'BSP VARIANCE',
        value: 3.2,  range: [1.4, 6.8], dec: 1,
        prefix: '-₹', suffix: 'L',
        meta: 'Q2 FY26 · Monthly',
        status: 'UNRECOVERED', type: 'danger',
        pos: { left: '4%', top: '56%' },
        tz: 12, rx: 3, ry: -5,
        dur: 5.5, del: 2.4, interval: 5100,
    },
    {
        label: 'OVERRIDE AT RISK',
        value: 4.8,  range: [2.0, 7.5], dec: 1,
        prefix: '+₹', suffix: 'L',
        meta: 'GDS Incentive · 1A',
        status: 'RENEWAL DUE', type: 'warning',
        pos: { right: '3%', top: '48%' },
        tz: -38, rx: -4, ry: 11,
        dur: 6.8, del: 0.8, interval: 4800,
    },
    {
        label: 'ADM WINDOW',
        value: 22,   range: [8, 28], dec: 0,
        prefix: '', suffix: ' days',
        meta: 'ADM #4471 · IndiGo',
        status: 'EXPIRING', type: 'warning',
        pos: { left: '9%', bottom: '13%' },
        tz: 18, rx: 2, ry: -6,
        dur: 7.2, del: 1.6, interval: 6200,
    },
    {
        label: 'RECOVERABLE',
        value: 25,   range: [18, 32], dec: 0,
        prefix: '₹', suffix: 'L/yr',
        meta: '3 active leaks',
        status: 'ACT NOW', type: 'blue',
        pos: { right: '6%', bottom: '11%' },
        tz: -12, rx: -3, ry: 9,
        dur: 5.9, del: 2.0, interval: 5500,
    },
];

const rndF = (a, b) => Math.random() * (b - a) + a;

export function initTerminal() {
    const hero = document.getElementById('hero');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const wrap = document.createElement('div');
    wrap.className = 'terminal-cards';
    wrap.setAttribute('aria-hidden', 'true');
    hero.prepend(wrap);

    const cardEls = [];

    CARDS.forEach((data) => {
        const el = document.createElement('div');
        el.className = `tcard tcard--${data.type}`;
        Object.entries(data.pos).forEach(([k, v]) => (el.style[k] = v));
        el.style.setProperty('--tz', data.tz + 'px');

        const fmt = (v) =>
            data.dec > 0
                ? v.toFixed(data.dec)
                : Math.round(v).toLocaleString('en-IN');

        el.innerHTML = `
            <div class="tcard-label">${data.label}</div>
            <div class="tcard-value">${data.prefix}<span class="tcard-num">${fmt(data.value)}</span>${data.suffix}</div>
            <div class="tcard-meta">${data.meta}</div>
            <span class="tcard-status tcard-status--${data.type}">${data.status}</span>
        `;

        wrap.appendChild(el);
        cardEls.push(el);

        // Initial 3D tilt
        gsap.set(el, { rotateX: data.rx, rotateY: data.ry, transformPerspective: 800, opacity: 0, y: 12 });

        // Entrance fade-in
        gsap.to(el, { opacity: 1, y: 0, duration: 0.8, delay: data.del + 0.4, ease: 'power2.out' });

        // Continuous float bob
        gsap.to(el, {
            y: `+=${9 + Math.random() * 5}`,
            duration: data.dur,
            delay: data.del,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        });

        // Live value ticker
        const tick = () => {
            const numEl = el.querySelector('.tcard-num');
            if (!numEl) return;
            const target = rndF(data.range[0], data.range[1]);
            const cur = { v: parseFloat(numEl.textContent.replace(/,/g, '')) };
            gsap.to(cur, {
                v: target,
                duration: 1.4,
                ease: 'power2.inOut',
                onUpdate() { numEl.textContent = fmt(cur.v); },
                onComplete() { setTimeout(tick, data.interval + rndF(-600, 600)); },
            });
        };
        setTimeout(tick, data.interval + data.del * 1000);
    });

    // Mouse parallax — subtle 3D depth shift on cursor move
    if (window.matchMedia('(pointer:fine)').matches) {
        let pending = false;
        let mx = 0, my = 0;

        document.addEventListener('mousemove', (e) => {
            mx = (e.clientX / window.innerWidth  - 0.5) * 2;
            my = (e.clientY / window.innerHeight - 0.5) * 2;
            if (!pending) {
                pending = true;
                requestAnimationFrame(() => {
                    pending = false;
                    cardEls.forEach((el, i) => {
                        const d = CARDS[i];
                        gsap.to(el, {
                            rotateX: d.rx + my * -5,
                            rotateY: d.ry + mx * 7,
                            duration: 1.4,
                            ease: 'power2.out',
                            overwrite: 'auto',
                        });
                    });
                });
            }
        }, { passive: true });
    }

    return () => wrap.remove();
}
