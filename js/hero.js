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
class Pt{
    constructor(){ this.reset(); }
    reset(){ this.x=Math.random()*cvs.width; this.y=Math.random()*cvs.height; this.vx=(Math.random()-.5)*.45; this.vy=(Math.random()-.5)*.45; this.r=Math.random()*1.4+.4; this.a=Math.random()*.5+.15; }
    step(){ this.x+=this.vx; this.y+=this.vy; if(this.x<0||this.x>cvs.width)this.vx*=-1; if(this.y<0||this.y>cvs.height)this.vy*=-1; }
    draw(){ ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fillStyle=`rgba(0,229,212,${this.a})`; ctx.fill(); }
}
for(let i=0;i<120;i++) pts.push(new Pt());
(function loop(){
    ctx.clearRect(0,0,cvs.width,cvs.height);
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
