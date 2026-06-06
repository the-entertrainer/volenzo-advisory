/* ── KINETIC SOUND ENGINEERING ──────────────── */
class JetAudio {
    constructor() {
        this.ctx = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.initialized = true;
    }

    playWhoosh(duration = 2.5, panValue = 0) {
        if (!this.ctx) this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createBufferSource();
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        // Synthesize white noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(100, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(3000, this.ctx.currentTime + duration * 0.5);
        filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + duration);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + duration * 0.3);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);

        const panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime(-1, this.ctx.currentTime);
        panner.pan.linearRampToValueAtTime(1, this.ctx.currentTime + duration);

        osc.buffer = buffer;
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(panner);
        panner.connect(this.ctx.destination);

        osc.start();
    }
}

const jetAudio = new JetAudio();

/* ── CURSOR ────────────────────────────────── */
const cur = document.getElementById('cur');
const curR = document.getElementById('curR');

document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    cur.style.left = x + 'px';
    cur.style.top = y + 'px';
    
    setTimeout(() => {
        curR.style.left = x + 'px';
        curR.style.top = y + 'px';
    }, 50);
});

const hoverables = document.querySelectorAll('a, button, .sv, .ab, .ec, input, textarea');
hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cur.classList.add('hover');
        curR.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        cur.classList.remove('hover');
        curR.classList.remove('hover');
    });
});

/* ── GSAP ANIMATIONS ───────────────────────── */
gsap.registerPlugin(ScrollTrigger);

// Hero Reveal
const tl = gsap.timeline();
tl.from('h1', { y: 100, opacity: 0, duration: 1.2, ease: "power4.out" })
  .from('.hero-p', { y: 50, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.8")
  .from('.hero-actions', { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");

// Plane Kinetic Flight Path
const plane = document.querySelector('.plane-container');
if (plane) {
    gsap.set(plane, { x: '-20vw', y: '80vh', scale: 0.5, rotation: 15 });
    
    tl.to(plane, {
        x: '120vw',
        y: '-20vh',
        scale: 1.5,
        rotation: -5,
        duration: 4,
        ease: "power2.inOut",
        onStart: () => {
            setTimeout(() => jetAudio.playWhoosh(4), 500);
        }
    }, 0.5);
}

// Scroll Linked Continuity Plane
const scrollPlane = document.createElement('div');
scrollPlane.className = 'plane-container scroll-plane';
scrollPlane.innerHTML = `<img src="assets/plane.png" class="plane-asset" style="opacity: 0.1; filter: grayscale(1) brightness(0.5);">`;
document.body.appendChild(scrollPlane);

gsap.set(scrollPlane, { position: 'fixed', top: '50%', right: '-100px', width: '200px' });

gsap.to(scrollPlane, {
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
    },
    y: '20vh',
    x: '-110vw',
    rotation: -20
});

/* ── NUMBERS COUNTER ───────────────────────── */
const counters = document.querySelectorAll('.count');
counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const suffix = counter.getAttribute('data-suffix') || '';
    const prefix = counter.getAttribute('data-prefix') || '';
    
    ScrollTrigger.create({
        trigger: counter,
        start: "top 90%",
        onEnter: () => {
            let count = 0;
            const updateCount = () => {
                const speed = target / 100;
                if (count < target) {
                    count += speed;
                    counter.innerText = prefix + Math.ceil(count) + suffix;
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = prefix + target + suffix;
                }
            };
            updateCount();
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

/* ── NAV BLUR ON SCROLL ────────────────────── */
window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    if (window.scrollY > 50) {
        nav.classList.add('bordered');
    } else {
        nav.classList.remove('bordered');
    }
});
