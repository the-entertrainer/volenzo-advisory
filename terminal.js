// terminal.js
// Desktop : 6 edge-peek cards, static DoF blur, infinite float
// Mobile  : 2×3 tiled grid — cards flip to randomised data at random
//           intervals; focus-plane DoF shifts blur dynamically across
//           all tiles as if a camera is pulling focus through 3-D space

import { gsap } from 'gsap';

// ── 12-entry data pool (drawn from randomly on every flip) ────────────────────
const POOL = [
    {
        label: 'ADM RAISED',
        range: [3.2, 14.5], dec: 1, prefix: '-₹', suffix: 'L',
        metas: ['6E-2847 · BOM-DEL', '6E-1124 · DEL-CCU', 'AI-302 · BOM-HYD'],
        statuses: ['PENDING', 'OVERDUE', 'ESCALATED'], type: 'danger',
    },
    {
        label: 'FARE MISSED',
        range: [820, 2100], dec: 0, prefix: '₹', suffix: '/pax',
        metas: ['NDC vs GDS · 6E', 'NDC gap · AI', 'NDC vs BSP · SG'],
        statuses: ['NDC ONLY', 'MISSED', 'GAP OPEN'], type: 'warning',
    },
    {
        label: 'BSP VARIANCE',
        range: [1.4, 6.8], dec: 1, prefix: '-₹', suffix: 'L',
        metas: ['Q2 FY26 · Monthly', 'Q3 FY26 · YTD', 'Oct FY26 · BSP'],
        statuses: ['UNRECOVERED', 'PARTIAL', 'AUDIT DUE'], type: 'danger',
    },
    {
        label: 'OVERRIDE AT RISK',
        range: [2.0, 7.5], dec: 1, prefix: '+₹', suffix: 'L',
        metas: ['GDS Incentive · 1A', 'PLB Q3 · 1W', 'Override · Sabre'],
        statuses: ['RENEWAL DUE', 'EXPIRING', 'CRITICAL'], type: 'warning',
    },
    {
        label: 'ADM WINDOW',
        range: [5, 28], dec: 0, prefix: '', suffix: ' days',
        metas: ['ADM #4471 · IndiGo', 'ADM #6612 · AI', 'ADM #2291 · 6E'],
        statuses: ['EXPIRING', 'CRITICAL', 'FINAL'], type: 'warning',
    },
    {
        label: 'RECOVERABLE',
        range: [18, 38], dec: 0, prefix: '₹', suffix: 'L/yr',
        metas: ['3 active leaks', '4 open ADMs', '2 NDC gaps'],
        statuses: ['ACT NOW', 'URGENT', 'OPEN'], type: 'blue',
    },
    {
        label: 'GDS INCENTIVE',
        range: [1.2, 5.5], dec: 1, prefix: '+₹', suffix: 'L',
        metas: ['Q3 Target · 1A', 'PLB FY26 · 1W', 'Override · GDS'],
        statuses: ['ON TRACK', 'Q3 TARGET', 'CLOSE'], type: 'blue',
    },
    {
        label: 'NDC SAVINGS',
        range: [380, 1850], dec: 0, prefix: '₹', suffix: '/bkg',
        metas: ['IndiGo NDC · Avg', 'SpiceJet NDC', 'Air India NDC'],
        statuses: ['ACTIVE', 'ENABLED', 'LIVE'], type: 'blue',
    },
    {
        label: 'PLB SHORTFALL',
        range: [0.5, 4.2], dec: 1, prefix: '-₹', suffix: 'L',
        metas: ['Q3 FY26 · Target', 'H2 FY26 · PLB', 'Annual · PLB'],
        statuses: ['MISSED', 'AT RISK', 'FLAGGED'], type: 'danger',
    },
    {
        label: 'DEBIT MEMOS',
        range: [3, 17], dec: 0, prefix: '', suffix: ' open',
        metas: ['IndiGo · FY26', 'Air India · Q3', 'All airlines'],
        statuses: ['PENDING', 'CRITICAL', 'OVERDUE'], type: 'danger',
    },
    {
        label: 'YIELD LOSS',
        range: [1.1, 5.8], dec: 1, prefix: '-₹', suffix: 'L/mo',
        metas: ['NDC miss · 6E', 'Fare gap · SG', 'GDS drift · 1A'],
        statuses: ['ONGOING', 'FLAGGED', 'MONITORED'], type: 'warning',
    },
    {
        label: 'COMMISSION GAP',
        range: [0.8, 3.5], dec: 1, prefix: '-₹', suffix: 'L',
        metas: ['6E Agency · Q3', 'AI Group · FY26', 'BSP audit · Q2'],
        statuses: ['AUDIT DUE', 'OPEN', 'UNRESOLVED'], type: 'danger',
    },
];

// ── Desktop edge-peek cards (fixed pool entries, unchanged) ───────────────────
const DESKTOP_CARDS = [
    { pos: { left: '-52px', top: '14%'     }, tz:  70, rx:  5, ry: -10, dur: 6.2, del: 0.0, interval: 4200, pi: 0 },
    { pos: { right: '-48px', top: '18%'    }, tz: -60, rx: -4, ry:  12, dur: 7.8, del: 1.2, interval: 3600, pi: 1 },
    { pos: { left: '-52px', top: '50%'     }, tz:  50, rx:  3, ry:  -7, dur: 5.5, del: 2.4, interval: 5100, pi: 2 },
    { pos: { right: '-48px', top: '55%'    }, tz: -85, rx: -5, ry:  14, dur: 6.8, del: 0.8, interval: 4800, pi: 3 },
    { pos: { left: '-52px', bottom: '20%'  }, tz:  60, rx:  4, ry:  -8, dur: 7.2, del: 1.6, interval: 6200, pi: 4 },
    { pos: { right: '-48px', bottom: '18%' }, tz: -45, rx: -3, ry:  10, dur: 5.9, del: 2.0, interval: 5500, pi: 5 },
];

// ── Mobile 2×3 grid positions — all inside the hero plane zone ────────────────
const MOBILE_GRID = [
    { left: '3%',  top:  '8%' },   // row 0, col 0
    { right: '3%', top:  '8%' },   // row 0, col 1
    { left: '3%',  top: '19%' },   // row 1, col 0
    { right: '3%', top: '19%' },   // row 1, col 1
    { left: '3%',  top: '30%' },   // row 2, col 0
    { right: '3%', top: '30%' },   // row 2, col 1
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const rndF  = (a, b) => Math.random() * (b - a) + a;
const rndEl = (arr)  => arr[Math.floor(Math.random() * arr.length)];

function pickCard() {
    const t = rndEl(POOL);
    return {
        template: t,
        label:  t.label,
        value:  rndF(t.range[0], t.range[1]),
        dec:    t.dec,
        prefix: t.prefix,
        suffix: t.suffix,
        meta:   rndEl(t.metas),
        status: rndEl(t.statuses),
        type:   t.type,
    };
}

function fmt(v, dec) {
    return dec > 0 ? v.toFixed(dec) : Math.round(v).toLocaleString('en-IN');
}

function cardHTML(c) {
    return `
        <div class="tcard-label">${c.label}</div>
        <div class="tcard-value">${c.prefix}<span class="tcard-num">${fmt(c.value, c.dec)}</span>${c.suffix}</div>
        <div class="tcard-meta">${c.meta}</div>
        <span class="tcard-status tcard-status--${c.type}">${c.status}</span>`;
}

// DoF blur from distance between a tile's current z-depth and the focus plane
function dofBlur(cardZ, focusZ) {
    return Math.min(3.0, Math.abs(cardZ - focusZ) * 0.026);
}

// Desktop static blur for far cards
function staticBlur(tz) {
    return tz >= 0 ? 0 : Math.min(5, Math.round(Math.abs(tz) / 16));
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function initTerminal() {
    const hero = document.getElementById('hero');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const mobile = window.innerWidth < 700;

    const wrap = document.createElement('div');
    wrap.className = 'terminal-cards';
    wrap.setAttribute('aria-hidden', 'true');
    hero.prepend(wrap);

    // ── MOBILE ────────────────────────────────────────────────────────────────
    if (mobile) {
        // Each tile gets an independent z-depth that changes on every flip.
        // Stagger initial depths across the full range so tiles start at
        // visually distinct positions in the 3-D scene.
        const tileZ = MOBILE_GRID.map((_, i) => rndF(-85, 85) * (i % 2 === 0 ? 1 : -1));
        const tileEls = [];

        // Focus plane oscillates through 3-D space. Duration and target are
        // re-randomised each yoyo so it never repeats the same path.
        const focus = { z: rndF(-20, 20) };
        const animateFocus = () => {
            gsap.to(focus, {
                z: rndF(-90, 90),
                duration: rndF(3.5, 7),
                ease: 'sine.inOut',
                onComplete: animateFocus,
            });
        };
        animateFocus();

        // Blur update ticker — smooth transitions, not per-frame
        const blurInterval = setInterval(() => {
            tileEls.forEach((el, i) => {
                const b = dofBlur(tileZ[i], focus.z);
                gsap.to(el, {
                    filter: `blur(${b.toFixed(1)}px)`,
                    duration: 0.6,
                    ease: 'sine.out',
                    overwrite: 'auto',
                });
            });
        }, 180);

        MOBILE_GRID.forEach((pos, i) => {
            let card = pickCard();

            const el = document.createElement('div');
            el.className = `tcard tcard--${card.type}`;
            Object.entries(pos).forEach(([k, v]) => (el.style[k] = v));
            el.innerHTML = cardHTML(card);
            wrap.appendChild(el);
            tileEls.push(el);

            // Gentle unique tilt per tile
            const rx0 = rndF(-5, 5), ry0 = rndF(-7, 7);

            gsap.set(el, {
                z: tileZ[i],
                rotateX: rx0,
                rotateY: ry0,
                transformPerspective: 900,
                opacity: 0,
                y: 12,
                filter: `blur(${dofBlur(tileZ[i], focus.z).toFixed(1)}px)`,
            });

            // Staggered entrance
            gsap.to(el, {
                opacity: 1, y: 0,
                duration: 0.7, delay: i * 0.22, ease: 'power2.out',
            });

            // Continuous gentle float unique to each tile
            gsap.to(el, {
                y: `+=${rndF(4, 9)}`,
                duration: rndF(4.5, 7.5),
                delay: i * 0.22,
                ease: 'sine.inOut',
                yoyo: true, repeat: -1,
            });

            // Number pulse while card is visible
            const pulseTicker = () => {
                const numEl = el.querySelector('.tcard-num');
                if (!numEl) return;
                const base = parseFloat(numEl.textContent.replace(/,/g, '')) || 1;
                const target = base * (1 + rndF(-0.09, 0.09));
                const cur = { v: base };
                gsap.to(cur, {
                    v: target, duration: 1.3, ease: 'power2.inOut',
                    onUpdate() {
                        const n = el.querySelector('.tcard-num');
                        if (n) n.textContent = fmt(cur.v, card.dec);
                    },
                    onComplete() { setTimeout(pulseTicker, rndF(2800, 5500)); },
                });
            };
            setTimeout(pulseTicker, i * 440 + rndF(1500, 3500));

            // Flip cycle ──────────────────────────────────────────────────────
            const scheduleFlip = () => {
                setTimeout(() => {
                    // Phase 1: rotate to 90° (card edge-on = invisible)
                    gsap.to(el, {
                        rotateY: 90,
                        duration: 0.2,
                        ease: 'power2.in',
                        onComplete() {
                            // Swap content + class
                            card = pickCard();
                            el.className = `tcard tcard--${card.type}`;
                            el.innerHTML = cardHTML(card);

                            // Assign a new random depth — repositions tile in 3-D scene
                            tileZ[i] = rndF(-85, 85);
                            const newRx = rndF(-5, 5);

                            gsap.set(el, { z: tileZ[i], rotateX: newRx });

                            // Phase 2: unroll from -90° → 0° (new face revealed)
                            gsap.fromTo(el,
                                { rotateY: -90 },
                                {
                                    rotateY: 0,
                                    duration: 0.2,
                                    ease: 'power2.out',
                                    onComplete: scheduleFlip,
                                }
                            );
                        },
                    });
                }, rndF(4000, 10500));
            };

            // Stagger first flip so tiles don't all flip at the same moment
            setTimeout(scheduleFlip, i * 1600 + rndF(2000, 4000));
        });

        return () => { clearInterval(blurInterval); wrap.remove(); };
    }

    // ── DESKTOP ───────────────────────────────────────────────────────────────
    const cardEls = [];

    DESKTOP_CARDS.forEach((cfg) => {
        const src = POOL[cfg.pi];
        const card = pickCard();
        card.template = src; // keep consistent range for ticker

        const el = document.createElement('div');
        const isNear = cfg.tz >= 0;
        el.className = `tcard tcard--${card.type}${isNear ? ' tcard--near' : ' tcard--far'}`;
        Object.entries(cfg.pos).forEach(([k, v]) => (el.style[k] = v));

        const blur0 = staticBlur(cfg.tz);
        el.innerHTML = cardHTML(card);
        wrap.appendChild(el);
        cardEls.push(el);

        const finalOpacity = isNear ? 1 : 0.78;
        gsap.set(el, {
            z: cfg.tz, rotateX: cfg.rx, rotateY: cfg.ry,
            opacity: 0, y: 16, transformPerspective: 900,
            filter: `blur(${blur0 + 5}px)`,
        });
        gsap.to(el, {
            opacity: finalOpacity, filter: `blur(${blur0}px)`, y: 0,
            duration: 0.9, delay: cfg.del + 0.5, ease: 'power2.out',
        });
        gsap.to(el, {
            y: `+=${10 + Math.random() * 6}`, duration: cfg.dur,
            delay: cfg.del, ease: 'sine.inOut', yoyo: true, repeat: -1,
        });

        // Live value ticker
        const tick = () => {
            const numEl = el.querySelector('.tcard-num');
            if (!numEl) return;
            const target = rndF(src.range[0], src.range[1]);
            const cur = { v: parseFloat(numEl.textContent.replace(/,/g, '')) };
            gsap.to(cur, {
                v: target, duration: 1.4, ease: 'power2.inOut',
                onUpdate() { numEl.textContent = fmt(cur.v, src.dec); },
                onComplete() { setTimeout(tick, rndF(3200, 6800)); },
            });
        };
        setTimeout(tick, cfg.interval + cfg.del * 1000);
    });

    // Mouse parallax
    if (window.matchMedia('(pointer:fine)').matches) {
        let pending = false, mx = 0, my = 0;
        document.addEventListener('mousemove', (e) => {
            mx = (e.clientX / window.innerWidth  - 0.5) * 2;
            my = (e.clientY / window.innerHeight - 0.5) * 2;
            if (!pending) {
                pending = true;
                requestAnimationFrame(() => {
                    pending = false;
                    cardEls.forEach((el, i) => {
                        const d = DESKTOP_CARDS[i];
                        const s = d.tz >= 0 ? 1 : 0.4;
                        gsap.to(el, {
                            rotateX: d.rx + my * -6 * s,
                            rotateY: d.ry + mx *  8 * s,
                            duration: 1.6, ease: 'power2.out', overwrite: 'auto',
                        });
                    });
                });
            }
        }, { passive: true });
    }

    return () => wrap.remove();
}
