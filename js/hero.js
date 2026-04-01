/* ─── HERO CANVAS ─── */
const cvs=document.getElementById('hc');
const ctx=cvs.getContext('2d');
let pts=[];
function resize(){
    const hero=document.getElementById('hero');
    cvs.width=hero.offsetWidth||window.innerWidth;
    cvs.height=hero.offsetHeight||window.innerHeight;
}
resize();
window.addEventListener('resize',resize);
window.addEventListener('load',()=>{ resize(); if(pts.length===0) for(let i=0;i<120;i++) pts.push(new Pt()); });

/* ─── PARTICLES ─── */
class Pt{
    constructor(){ this.reset(); }
    reset(){ this.x=Math.random()*cvs.width; this.y=Math.random()*cvs.height; this.vx=(Math.random()-.5)*.45; this.vy=(Math.random()-.5)*.45; this.r=Math.random()*1.4+.4; this.a=Math.random()*.5+.15; }
    step(){ this.x+=this.vx; this.y+=this.vy; if(this.x<0||this.x>cvs.width)this.vx*=-1; if(this.y<0||this.y>cvs.height)this.vy*=-1; }
    draw(){ ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fillStyle=`rgba(0,229,212,${this.a})`; ctx.fill(); }
}
for(let i=0;i<120;i++) pts.push(new Pt());

/* ─── PLANETS ─── */
const PLANETS=[
    { x:.82, y:.18, r:38, vx:.018, vy:.010, color:'#0D1F2D', ring:true,  ringColor:'rgba(0,229,212,.18)', tilt:.38 },
    { x:.12, y:.72, r:22, vx:-.012, vy:.016, color:'#1A1008', ring:false, glow:'rgba(255,179,0,.12)' },
    { x:.68, y:.78, r:14, vx:.022, vy:-.014, color:'#0A1A1A', ring:false, glow:'rgba(0,229,212,.10)' },
    { x:.28, y:.22, r:9,  vx:-.018, vy:-.022, color:'#160A1A', ring:false, glow:'rgba(255,61,113,.08)' },
    { x:.92, y:.55, r:6,  vx:.014, vy:.020,  color:'#0D1220', ring:false, glow:'rgba(0,229,212,.08)' },
];
function initPlanets(){ PLANETS.forEach(p=>{ p.cx=p.x*cvs.width; p.cy=p.y*cvs.height; }); }
initPlanets();
window.addEventListener('resize', initPlanets);

function lighten(hex,pct){ const n=parseInt(hex.slice(1),16); const r=Math.min(255,(n>>16)+pct),g=Math.min(255,((n>>8)&0xff)+pct),b=Math.min(255,(n&0xff)+pct); return `rgb(${r},${g},${b})`; }
function darken(hex,pct){ const n=parseInt(hex.slice(1),16); const r=Math.max(0,(n>>16)-pct),g=Math.max(0,((n>>8)&0xff)-pct),b=Math.max(0,(n&0xff)-pct); return `rgb(${r},${g},${b})`; }

function drawPlanet(p){
    ctx.save(); ctx.translate(p.cx,p.cy);
    if(p.glow){ const h=ctx.createRadialGradient(0,0,p.r*.6,0,0,p.r*2.8); h.addColorStop(0,p.glow); h.addColorStop(1,'transparent'); ctx.beginPath(); ctx.arc(0,0,p.r*2.8,0,Math.PI*2); ctx.fillStyle=h; ctx.fill(); }
    if(p.ring){ ctx.save(); ctx.rotate(p.tilt); ctx.scale(1,.28); ctx.beginPath(); ctx.arc(0,0,p.r*1.9,0,Math.PI); ctx.strokeStyle=p.ringColor; ctx.lineWidth=5; ctx.stroke(); ctx.restore(); }
    const g=ctx.createRadialGradient(-p.r*.3,-p.r*.3,p.r*.1,0,0,p.r); g.addColorStop(0,lighten(p.color,40)); g.addColorStop(.5,p.color); g.addColorStop(1,darken(p.color,30));
    ctx.beginPath(); ctx.arc(0,0,p.r,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
    const s=ctx.createRadialGradient(-p.r*.28,-p.r*.28,0,-p.r*.1,-p.r*.1,p.r*.7); s.addColorStop(0,'rgba(255,255,255,.07)'); s.addColorStop(1,'transparent');
    ctx.beginPath(); ctx.arc(0,0,p.r,0,Math.PI*2); ctx.fillStyle=s; ctx.fill();
    if(p.ring){ ctx.save(); ctx.rotate(p.tilt); ctx.scale(1,.28); ctx.beginPath(); ctx.arc(0,0,p.r*1.9,Math.PI,Math.PI*2); ctx.strokeStyle=p.ringColor; ctx.lineWidth=5; ctx.stroke(); ctx.restore(); }
    ctx.restore();
}

/* ─── LOOP ─── */
(function loop(){
    ctx.clearRect(0,0,cvs.width,cvs.height);

    PLANETS.forEach(p=>{
        p.cx+=p.vx; p.cy+=p.vy;
        const pad=p.r*3;
        if(p.cx<-pad) p.cx=cvs.width+pad; if(p.cx>cvs.width+pad) p.cx=-pad;
        if(p.cy<-pad) p.cy=cvs.height+pad; if(p.cy>cvs.height+pad) p.cy=-pad;
        drawPlanet(p);
    });

    pts.forEach(p=>{p.step();p.draw();});
    for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.hypot(dx,dy);
        if(d<130){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle=`rgba(0,229,212,${(1-d/130)*.12})`; ctx.lineWidth=.5; ctx.stroke(); }
    }

    requestAnimationFrame(loop);
})();

document.getElementById('hero').addEventListener('mousemove',e=>{
    const r=cvs.getBoundingClientRect(),hx=e.clientX-r.left,hy=e.clientY-r.top;
    pts.forEach(p=>{ const dx=p.x-hx,dy=p.y-hy,d=Math.hypot(dx,dy); if(d<110){ p.vx+=dx/d*.04; p.vy+=dy/d*.04; }});
});

/* ─── ROLE ROTATION ─── */
const roles=['Développeur IA','Créateur de SaaS','Expert Automatisation','Full-Stack Developer','Voice AI Engineer'];
let ri=0; const re=document.getElementById('h-role');
setInterval(()=>{
    re.style.opacity='0'; re.style.transform='translateY(-10px)';
    setTimeout(()=>{ ri=(ri+1)%roles.length; re.textContent=roles[ri]; re.style.transition='opacity .5s,transform .5s'; re.style.opacity='1'; re.style.transform='translateY(0)'; },300);
},3200);
