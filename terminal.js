// terminal.js — Floating financial data cards, true 3D depth + DoF blur

import { gsap } from 'gsap';

// tz > 0 = closer (sharp, opaque)   tz < 0 = further (blurred, dimmer)
// Near cards peek from the LEFT margin; far cards sit in the RIGHT margin
const CARDS = [
    {
        label: 'ADM RAISED',
        value: 8.4,  range: [3.2, 14.5], dec: 1,
        prefix: '-₹', suffix: 'L',
        meta: '6E-2847 · BOM-DEL',
        status: 'PENDING', type: 'danger',
        pos: { left: '-52px', top: '14%' },   // near — left-edge peek
        tz: 70, rx: 5, ry: -10,
        dur: 6.2, del: 0, interval: 4200,
    },
    {
        label: 'FARE MISSED',
        value: 1240, range: [820, 2100], dec: 0,
        prefix: '₹', suffix: '/pax',
        meta: 'NDC vs GDS · 6E',
        status: 'NDC ONLY', type: 'warning',
        pos: { right: '-48px', top: '18%' },  // far — right-edge peek
        tz: -60, rx: -4, ry: 12,
        dur: 7.8, del: 1.2, interval: 3600,
    },
    {
        label: 'BSP VARIANCE',
        value: 3.2,  range: [1.4, 6.8], dec: 1,
        prefix: '-₹', suffix: 'L',
        meta: 'Q2 FY26 · Monthly',
        status: 'UNRECOVERED', type: 'danger',
        pos: { left: '-52px', top: '50%' },   // near — left-edge peek
        tz: 50, rx: 3, ry: -7,
        dur: 5.5, del: 2.4, interval: 5100,
    },
    {
        label: 'OVERRIDE AT RISK',
        value: 4.8,  range: [2.0, 7.5], dec: 1,
        prefix: '+₹', suffix: 'L',
        meta: 'GDS Incentive · 1A',
        status: 'RENEWAL DUE', type: 'warning',
        pos: { right: '-48px', top: '55%' },  // far — right-edge peek
        tz: -85, rx: -5, ry: 14,
        dur: 6.8, del: 0.8, interval: 4800,
    },
    {
        label: 'ADM WINDOW',
        value: 22,   range: [8, 28], dec: 0,
        prefix: '', suffix: ' days',
        meta: 'ADM #4471 · IndiGo',
        status: 'EXPIRING', type: 'warning',
        pos: { left: '-52px', bottom: '20%' }, // near — left-edge peek
        tz: 60, rx: 4, ry: -8,
        dur: 7.2, del: 1.6, interval: 6200,
    },
    {
        label: 'RECOVERABLE',
        value: 25,   range: [18, 32], dec: 0,
        prefix: '₹', suffix: 'L/yr',
        meta: '3 active leaks',
        status: 'ACT NOW', type: 'blue',
        pos: { right: '-48px', bottom: '18%' }, // far — right-edge peek
        tz: -45, rx: -3, ry: 10,
        dur: 5.9, del: 2.0, interval: 5500,
    },
];

const rndF = (a, b) => Math.random() * (b - a) + a;

// Depth-of-field blur: subtle — far cards are readable, just softer
function depthBlur(tz) {
    if (tz >= 0) return 0;
    return Math.min(5, Math.round(Math.abs(tz) / 16));
}

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
        const isNear = data.tz >= 0;
        el.className = `tcard tcard--${data.type}${isNear ? ' tcard--near' : ' tcard--far'}`;
        Object.entries(data.pos).forEach(([k, v]) => (el.style[k] = v));

        // Apply depth-of-field blur to far cards via filter
        const blur = depthBlur(data.tz);
        if (blur > 0) el.style.filter = `blur(${blur}px)`;

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

        // transformPerspective makes tz produce a real scale difference per-element
        const finalOpacity = isNear ? 1 : 0.78;
        gsap.set(el, { z: data.tz, rotateX: data.rx, rotateY: data.ry, opacity: 0, y: 16, transformPerspective: 900 });

        // Entrance
        gsap.to(el, {
            opacity: finalOpacity, y: 0,
            duration: 0.9, delay: data.del + 0.5, ease: 'power2.out',
        });

        // Float bob (on top of GSAP z/rotate)
        gsap.to(el, {
            y: `+=${10 + Math.random() * 6}`,
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

    // Mouse parallax — near cards move more, far cards less (depth cue)
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
                        const scale = d.tz >= 0 ? 1 : 0.4; // near cards respond more
                        gsap.to(el, {
                            rotateX: d.rx + my * -6 * scale,
                            rotateY: d.ry + mx * 8 * scale,
                            duration: 1.6,
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
