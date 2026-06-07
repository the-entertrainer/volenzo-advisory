// terminal.js — Floating financial data cards
// Desktop : peek from left/right viewport edges, infinite float
// Mobile  : all 6 cards cycle — spawn → float → recede, async, dynamic blur

import { gsap } from 'gsap';

const CARDS = [
    {
        label: 'ADM RAISED',
        value: 8.4,  range: [3.2, 14.5], dec: 1,
        prefix: '-₹', suffix: 'L',
        meta: '6E-2847 · BOM-DEL',
        status: 'PENDING', type: 'danger',
        pos:       { left: '-52px', top: '14%'  },
        mobilePos: { left:   '4%', top:  '9%'  },
        tz: 70,  rx:  5, ry: -10, dur: 6.2, del: 0.0, interval: 4200,
    },
    {
        label: 'FARE MISSED',
        value: 1240, range: [820, 2100], dec: 0,
        prefix: '₹', suffix: '/pax',
        meta: 'NDC vs GDS · 6E',
        status: 'NDC ONLY', type: 'warning',
        pos:       { right: '-48px', top: '18%'  },
        mobilePos: { right:   '4%', top:  '8%'  },
        tz: -60, rx: -4, ry:  12, dur: 7.8, del: 1.2, interval: 3600,
    },
    {
        label: 'BSP VARIANCE',
        value: 3.2,  range: [1.4, 6.8], dec: 1,
        prefix: '-₹', suffix: 'L',
        meta: 'Q2 FY26 · Monthly',
        status: 'UNRECOVERED', type: 'danger',
        pos:       { left: '-52px', top: '50%'  },
        mobilePos: { left:   '6%', top: '27%'  },
        tz: 50,  rx:  3, ry:  -7, dur: 5.5, del: 2.4, interval: 5100,
    },
    {
        label: 'OVERRIDE AT RISK',
        value: 4.8,  range: [2.0, 7.5], dec: 1,
        prefix: '+₹', suffix: 'L',
        meta: 'GDS Incentive · 1A',
        status: 'RENEWAL DUE', type: 'warning',
        pos:       { right: '-48px', top: '55%'  },
        mobilePos: { right:   '6%', top: '26%'  },
        tz: -85, rx: -5, ry:  14, dur: 6.8, del: 0.8, interval: 4800,
    },
    {
        label: 'ADM WINDOW',
        value: 22,   range: [8, 28], dec: 0,
        prefix: '', suffix: ' days',
        meta: 'ADM #4471 · IndiGo',
        status: 'EXPIRING', type: 'warning',
        pos:       { left: '-52px', bottom: '20%' },
        mobilePos: { left:   '4%', top:  '31%' },  // row 3 — kept inside plane zone
        tz: 60,  rx:  4, ry:  -8, dur: 7.2, del: 1.6, interval: 6200,
    },
    {
        label: 'RECOVERABLE',
        value: 25,   range: [18, 32], dec: 0,
        prefix: '₹', suffix: 'L/yr',
        meta: '3 active leaks',
        status: 'ACT NOW', type: 'blue',
        pos:       { right: '-48px', bottom: '18%' },
        mobilePos: { right:   '4%', top:  '30%' },  // row 3 — kept inside plane zone
        tz: -45, rx: -3, ry:  10, dur: 5.9, del: 2.0, interval: 5500,
    },
];

const rndF = (a, b) => Math.random() * (b - a) + a;

// How blurry a far card looks when fully "present"
function baseBlur(tz) {
    if (tz >= 0) return 0;
    return Math.min(5, Math.round(Math.abs(tz) / 16));
}

export function initTerminal() {
    const hero = document.getElementById('hero');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const mobile = window.innerWidth < 700;

    const wrap = document.createElement('div');
    wrap.className = 'terminal-cards';
    wrap.setAttribute('aria-hidden', 'true');
    hero.prepend(wrap);

    const cardEls = [];

    CARDS.forEach((data, idx) => {
        const el = document.createElement('div');
        const isNear = data.tz >= 0;
        el.className = `tcard tcard--${data.type}${isNear ? ' tcard--near' : ' tcard--far'}`;

        // Apply position — JS inline wins over CSS class rules
        const pos = mobile ? data.mobilePos : data.pos;
        Object.entries(pos).forEach(([k, v]) => (el.style[k] = v));

        const blur0 = baseBlur(data.tz);           // blur when card is "present"
        const blurIn  = blur0 + (mobile ? 9 : 5);  // blur when card first spawns
        const blurOut = blur0 + (mobile ? 12 : 5); // blur when card recedes
        const targetOpacity = isNear ? 1 : 0.78;

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

        gsap.set(el, {
            z: data.tz,
            rotateX: data.rx,
            rotateY: data.ry,
            opacity: 0,
            y: 14,
            transformPerspective: 900,
            filter: `blur(${blurIn}px)`,
        });

        // ── Mobile: continuous spawn → float → recede cycle ───────────────
        if (mobile) {
            // Stagger so cards don't all appear simultaneously
            const startDelay = idx * 1.15 + rndF(0, 1.0);

            const cycle = () => {
                const stayMs = rndF(3400, 7000);
                const gapMs  = rndF(1200, 3400);

                // Reset to pre-spawn state (invisible, blurry, slightly low)
                gsap.set(el, { filter: `blur(${blurIn}px)`, y: 14, opacity: 0 });

                // — Spawn: drift up + sharpen + fade in —
                gsap.to(el, {
                    opacity: targetOpacity,
                    filter: `blur(${blur0}px)`,
                    y: 0,
                    duration: 0.85,
                    ease: 'power2.out',
                    onComplete() {
                        // — Float while visible —
                        gsap.to(el, {
                            y: `+=${5 + rndF(0, 4)}`,
                            duration: data.dur * 0.65,
                            ease: 'sine.inOut',
                            yoyo: true,
                            repeat: -1,
                        });

                        // — Recede: blur out + drift up + fade out —
                        setTimeout(() => {
                            gsap.killTweensOf(el); // stop float
                            gsap.to(el, {
                                opacity: 0,
                                filter: `blur(${blurOut}px)`,
                                y: -10,
                                duration: 1.05,
                                ease: 'power2.in',
                                onComplete() {
                                    setTimeout(cycle, gapMs + rndF(0, 500));
                                },
                            });
                        }, stayMs);
                    },
                });
            };

            setTimeout(cycle, startDelay * 1000);

        // ── Desktop: entrance once, then infinite float ────────────────────
        } else {
            gsap.to(el, {
                opacity: targetOpacity,
                filter: `blur(${blur0}px)`,
                y: 0,
                duration: 0.9,
                delay: data.del + 0.5,
                ease: 'power2.out',
            });

            gsap.to(el, {
                y: `+=${10 + Math.random() * 6}`,
                duration: data.dur,
                delay: data.del,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            });
        }

        // Live value ticker — runs on both platforms
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

    // Mouse parallax — desktop only
    if (!mobile && window.matchMedia('(pointer:fine)').matches) {
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
                        const s = d.tz >= 0 ? 1 : 0.4;
                        gsap.to(el, {
                            rotateX: d.rx + my * -6 * s,
                            rotateY: d.ry + mx *  8 * s,
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
