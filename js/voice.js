/* ─── VOICE — Gemini 2.5 Flash Native Audio ─── */
let audioCtx=null, audioSrc=null, playing=false;

async function speak(){
    if(playing){
        if(audioSrc){audioSrc.stop();audioSrc=null;}
        playing=false; resetVoice(); return;
    }
    document.getElementById('v-st').textContent='GÉNÉRATION IA EN COURS...';
    document.getElementById('v-ico').textContent='⏳';
    document.getElementById('v-orb').classList.add('on');
    try{
        const res=await fetch('http://localhost:8081/api/voice');
        if(!res.ok) throw new Error('Serveur vocal indisponible (lancer voice_server.py)');
        const buf=await res.arrayBuffer();
        if(!audioCtx) audioCtx=new(window.AudioContext||window.webkitAudioContext)();
        const decoded=await audioCtx.decodeAudioData(buf);
        audioSrc=audioCtx.createBufferSource();
        audioSrc.buffer=decoded;
        audioSrc.connect(audioCtx.destination);
        playing=true;
        document.getElementById('wf').classList.add('on');
        document.getElementById('v-st').textContent='IA EN TRAIN DE PARLER... (cliquer pour arrêter)';
        document.getElementById('v-ico').textContent='⏹️';
        audioSrc.onended=()=>{playing=false;audioSrc=null;resetVoice();};
        audioSrc.start(0);
    }catch(e){
        console.warn(e);
        document.getElementById('v-st').textContent='Démarrez voice_server.py sur le port 8081';
        document.getElementById('v-ico').textContent='🎙️';
        document.getElementById('v-orb').classList.remove('on');
    }
}
function resetVoice(){
    document.getElementById('v-orb').classList.remove('on');
    document.getElementById('wf').classList.remove('on');
    document.getElementById('v-st').textContent='CLIQUEZ POUR ÉCOUTER';
    document.getElementById('v-ico').textContent='🎙️';
}
