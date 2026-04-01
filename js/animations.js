/* ─── NAV SCROLL ─── */
window.addEventListener('scroll',()=>{ document.getElementById('nav').classList.toggle('on',scrollY>50); });

/* ─── BURGER MENU ─── */
const burger=document.getElementById('n-burger');
const navLinks=document.querySelector('.n-links');
if(burger){
    burger.addEventListener('click',()=>{
        burger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });
    // Fermer au clic sur un lien
    navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
        burger.classList.remove('open');
        navLinks.classList.remove('open');
    }));
}

/* ─── REVEAL ─── */
const obs=new IntersectionObserver((entries)=>{
    entries.forEach((e,i)=>{ if(e.isIntersecting) setTimeout(()=>e.target.classList.add('on'),i*80); });
},{threshold:.1});
document.querySelectorAll('.rv').forEach(el=>obs.observe(el));

/* ─── COUNTERS ─── */
const cobs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){
        e.target.querySelectorAll('.st-num').forEach(n=>{
            const tgt=+n.dataset.t; let v=0;
            const t=setInterval(()=>{ v+=tgt/120; if(v>=tgt){ n.textContent=tgt+(tgt===100?'%':'+'); clearInterval(t); } else n.textContent=Math.floor(v); },16);
        });
        cobs.unobserve(e.target);
    }});
},{threshold:.5});
const st=document.getElementById('stats'); if(st)cobs.observe(st);

/* ─── 3D TILT ─── */
document.querySelectorAll('.sv-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
        const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`perspective(700px) rotateY(${x*9}deg) rotateX(${-y*9}deg) translateZ(12px)`;
    });
    card.addEventListener('mouseleave',()=>card.style.transform='perspective(700px) rotateY(0) rotateX(0)');
});

/* ─── PROCESS ─── */
const procObs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
        if(e.isIntersecting){
            // Ligne
            const line = document.getElementById('proc-line');
            if(line) setTimeout(()=>line.classList.add('on'), 100);
            // Steps
            e.target.querySelectorAll('.process-step').forEach(s=>{
                const delay = parseInt(s.dataset.delay)||0;
                setTimeout(()=>s.classList.add('on'), delay+200);
            });
            procObs.unobserve(e.target);
        }
    });
},{threshold:.2});
const procTrack = document.getElementById('process-track');
if(procTrack) procObs.observe(procTrack);

/* ─── ROI BARS ─── */
const roiBarObs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
        if(e.isIntersecting){
            e.target.querySelectorAll('.roi-bar-fill').forEach((b,i)=>{
                setTimeout(()=>b.classList.add('on'), i*140);
            });
            roiBarObs.unobserve(e.target);
        }
    });
},{threshold:.25});
const roiBarsEl = document.getElementById('roi-bars');
if(roiBarsEl) roiBarObs.observe(roiBarsEl);

/* ─── ROI CIRCLES ─── */
const roiCircleObs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
        if(e.isIntersecting){
            e.target.querySelectorAll('.roi-circle-fill').forEach((c,i)=>{
                const pct = parseFloat(c.dataset.pct)||0;
                setTimeout(()=>{ c.style.strokeDashoffset = 245*(1-pct); }, i*180);
            });
            roiCircleObs.unobserve(e.target);
        }
    });
},{threshold:.2});
const roiCasesEl = document.getElementById('roi-cases');
if(roiCasesEl) roiCircleObs.observe(roiCasesEl);

/* ─── ROI KPI COUNTERS ─── */
const roiKpiObs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
        if(e.isIntersecting){
            e.target.querySelectorAll('.roi-kpi-num[data-t]').forEach(n=>{
                const tgt=+n.dataset.t; let v=0;
                const t=setInterval(()=>{ v+=tgt/80; if(v>=tgt){n.textContent=tgt;clearInterval(t);}else n.textContent=Math.floor(v); },16);
            });
            roiKpiObs.unobserve(e.target);
        }
    });
},{threshold:.4});
const roiKpisEl = document.getElementById('roi-kpis');
if(roiKpisEl) roiKpiObs.observe(roiKpisEl);

/* ─── FORM ─── */
function submitForm(){
    const n=document.getElementById('f-name').value,e=document.getElementById('f-email').value;
    if(!n||!e){alert('Veuillez remplir au minimum votre nom et votre email.');return;}
    window.location.href=`mailto:admin@bizops.fr?subject=Nouveau projet - ${encodeURIComponent(n)}&body=De: ${encodeURIComponent(n)}%0AEmail: ${encodeURIComponent(e)}%0AProjet: ${encodeURIComponent(document.getElementById('f-project').value)}%0A%0AMessage:%0A${encodeURIComponent(document.getElementById('f-msg').value)}`;
}
