/* ─── SCROLL VIDEO ─── */
(function(){
    const FRAME_COUNT = 160;
    const canvas = document.getElementById('sv-canvas');
    const ctx = canvas.getContext('2d');
    const frames = [];
    let loaded = 0;
    let currentFrame = 0;

    function resize(){
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        if(frames[currentFrame]?.complete && frames[currentFrame]?.naturalWidth) draw(frames[currentFrame]);
    }
    resize();
    window.addEventListener('resize', resize);

    function draw(img){
        if(!img?.complete || !img.naturalWidth) return;
        const cw=canvas.width, ch=canvas.height;
        const iw=img.naturalWidth, ih=img.naturalHeight;
        const scale = Math.max(cw/iw, ch/ih);
        const dw=iw*scale, dh=ih*scale;
        ctx.drawImage(img, (cw-dw)/2, (ch-dh)/2, dw, dh);
    }

    // Charger frame 0 en premier — affichage immédiat
    const f0 = new Image();
    f0.src = 'frames/f0001.jpg';
    f0.onload = () => { loaded++; draw(f0); };
    frames[0] = f0;

    // Charger le reste
    for(let i=1; i<FRAME_COUNT; i++){
        const img = new Image();
        img.src = `frames/f${String(i).padStart(4,'0')}.jpg`;
        img.onload = () => { loaded++; };
        frames[i] = img;
    }

    window.addEventListener('scroll', ()=>{
        const section = document.getElementById('sv-section');
        if(!section) return;
        const rect = section.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / (section.offsetHeight - window.innerHeight)));

        // Frame courante
        const idx = Math.min(FRAME_COUNT-1, Math.floor(progress * FRAME_COUNT));
        if(frames[idx]?.complete && frames[idx]?.naturalWidth){
            currentFrame=idx; draw(frames[idx]);
        }

        // Barre de progression
        document.getElementById('sv-bar').style.width = (progress*100)+'%';

        // Texte central : apparaît entre 35% et 75%
        const content = document.getElementById('sv-content');
        if(progress > 0.35 && progress < 0.75){
            const t = Math.min(1,(progress-0.35)/0.15);
            content.style.opacity = t;
            content.style.transform = `translateY(${(1-t)*20}px)`;
        } else {
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
        }

        // Hint scroll
        const hint = document.getElementById('sv-hint');
        if(hint) hint.textContent = progress > 0.95 ? 'CONTINUER' : 'SCROLL POUR EXPLORER';
    });
})();
