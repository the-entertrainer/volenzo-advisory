// Bloomberg Terminal backdrop — scrolling BSP/GDS/ADM data canvas

const AIRLINES  = ['6E','AI','SG','UK','2I','QP','IX','G8'];
const ROUTES    = ['BOM-DEL','DEL-BLR','BLR-HYD','HYD-MAA','BOM-CCU','DEL-MAA','AMD-BOM','CCU-DEL','PNQ-BLR','VTZ-MAA','BBI-DEL','IXC-BOM'];
const FARE_CLS  = ['Y','B','H','K','M','L','V','S','N','Q','O','G','W','E'];
const STATUSES  = ['PENDING','CLEARED','EXPIRED','REVIEWED','FILED','LAPSED'];
const GDS_LIST  = ['SABRE','AMADEUS','GALILEO','WORLDSPAN'];
const MONTHS    = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

const rnd   = (a) => a[Math.floor(Math.random() * a.length)];
const rndI  = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const rndF  = (a, b) => (Math.random() * (b - a) + a).toFixed(1);
const bsp   = () => 'BSP-' + Math.random().toString(36).slice(2, 9).toUpperCase();
const adm   = () => `ADM/${rndI(1000,9999)}/${rndI(24,26)}`;
const amt   = () => `₹${rndF(0.5, 13.5)}L`;
const pad   = (s, n) => String(s).padEnd(n);

function genRow(colType) {
    const al = rnd(AIRLINES);
    const flt = `${al}-${rndI(100,9999)}`;
    const rt  = rnd(ROUTES);
    const fc  = rnd(FARE_CLS);
    switch (colType) {
        case 0: return `${pad(flt,9)} ${pad(rt,10)} ${fc}  ${pad(bsp(),14)} ${amt()}`;
        case 1: return `${pad(adm(),15)} ${al}  ${pad(rt,10)} ${pad(amt(),9)} ${rnd(FARE_CLS)}`;
        case 2: return `${pad(bsp(),14)} ${rndI(1,28)} ${rnd(MONTHS)} ${pad(rt,10)} ${rnd(STATUSES)}`;
        case 3: return `${pad(rnd(GDS_LIST),10)} PLB ${rndF(0.5,4.2)}%  ${pad(rt,10)} ${flt}`;
    }
}

export function initTerminal() {
    const hero = document.getElementById('hero');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'terminal-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    hero.prepend(canvas);

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const LINE_H   = 20;
    const FONT_SZ  = 10;
    const FONT     = `${FONT_SZ}px 'Courier New', Courier, monospace`;
    const SPEEDS   = [0.022, 0.015, 0.019, 0.012]; // px per ms

    let cols = [];
    let rafId = null;
    let lastTs = null;

    function buildCols() {
        const w = hero.offsetWidth;
        const h = hero.offsetHeight;
        const colW = Math.floor(w / 4);
        cols = Array.from({ length: 4 }, (_, i) => {
            const n = Math.ceil(h / LINE_H) + 10;
            return {
                x: i * colW + 10,
                speed: SPEEDS[i],
                type: i,
                rows: Array.from({ length: n }, (_, j) => ({
                    text: genRow(i),
                    y: j * LINE_H + LINE_H,
                    alert: Math.random() < 0.035,
                })),
            };
        });
    }

    function resize() {
        const w = hero.offsetWidth;
        const h = hero.offsetHeight;
        canvas.style.width  = w + 'px';
        canvas.style.height = h + 'px';
        canvas.width  = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
        resize();
        buildCols();
    }
    init();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { init(); }, 150);
    }, { passive: true });

    function frame(ts) {
        if (!lastTs) lastTs = ts;
        const dt = Math.min(ts - lastTs, 50);
        lastTs = ts;

        const w = hero.offsetWidth;
        const h = hero.offsetHeight;
        ctx.clearRect(0, 0, w, h);
        ctx.font = FONT;
        ctx.textBaseline = 'alphabetic';

        cols.forEach(col => {
            col.rows.forEach(row => {
                row.y -= col.speed * dt;
                if (row.y < -LINE_H) {
                    const maxY = col.rows.reduce((m, r) => Math.max(m, r.y), 0);
                    row.y     = maxY + LINE_H;
                    row.text  = genRow(col.type);
                    row.alert = Math.random() < 0.035;
                }
                if (row.y < 0 || row.y > h + LINE_H) return;
                ctx.fillStyle = row.alert
                    ? 'rgba(212,28,44,0.22)'
                    : 'rgba(0,55,180,0.14)';
                ctx.fillText(row.text, col.x, row.y);
            });
        });

        rafId = requestAnimationFrame(frame);
    }

    const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            lastTs = null;
            if (!rafId) rafId = requestAnimationFrame(frame);
        } else {
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        }
    }, { threshold: 0 });
    io.observe(hero);

    return () => {
        cancelAnimationFrame(rafId);
        io.disconnect();
        canvas.remove();
    };
}
