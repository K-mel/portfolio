/* ─── LOADER ─── */
window.addEventListener('load',()=>{
    setTimeout(()=>{
        const l=document.getElementById('loader');
        l.style.transition='opacity .8s';l.style.opacity='0';
        setTimeout(()=>{ l.style.display='none'; resize(); },800);
    },2400);
});
