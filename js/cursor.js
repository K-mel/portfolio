/* ─── CURSOR — desktop uniquement ─── */
const isTouch = (
    window.matchMedia('(pointer: coarse)').matches ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
);

if (!isTouch) {
    const cx  = document.getElementById('cx');
    const ci2 = document.getElementById('ci');
    cx.style.display  = 'block';
    ci2.style.display = 'block';

    let mx=0, my=0, ox=0, oy=0;
    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        ci2.style.transform = `translate(${mx}px,${my}px)`;
    });
    (function raf(){
        ox += (mx-ox) * .14;
        oy += (my-oy) * .14;
        cx.style.transform = `translate(${ox}px,${oy}px)`;
        requestAnimationFrame(raf);
    })();
    document.querySelectorAll('a,button,.sv-card,.pj-card,.t-pill,.v-orb').forEach(el => {
        el.addEventListener('mouseenter', () => { cx.style.transform += ' scale(1.6)'; cx.style.borderColor = 'var(--amber)'; });
        el.addEventListener('mouseleave', () => { cx.style.borderColor = 'var(--teal)'; });
    });
}
