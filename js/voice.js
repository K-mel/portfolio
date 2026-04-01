/* ─── VOICE — HTML Audio (compatible iOS Safari) ─── */
let audio = null, playing = false;

async function speak(){
    const orb = document.getElementById('v-orb');
    const ico = document.getElementById('v-ico');
    const st  = document.getElementById('v-st');
    const wf  = document.getElementById('wf');

    if(playing){
        if(audio){ audio.pause(); audio.currentTime = 0; }
        playing = false; resetVoice(); return;
    }

    ico.textContent='⏳';
    st.textContent='CHARGEMENT...';
    orb.classList.add('on');

    try {
        if(!audio){
            audio = new Audio('presentation.wav');
            audio.preload = 'auto';
        }
        audio.currentTime = 0;
        const p = audio.play();
        if(p !== undefined) await p;
        playing = true;
        wf.classList.add('on');
        ico.textContent='⏹️';
        st.textContent='IA EN TRAIN DE PARLER... (cliquer pour arrêter)';
        audio.onended = () => { playing = false; resetVoice(); };
    } catch(e) {
        console.warn('Voice error:', e);
        ico.textContent='🎙️';
        st.textContent='ERREUR — réessayez';
        orb.classList.remove('on');
    }
}

function resetVoice(){
    document.getElementById('v-orb').classList.remove('on');
    document.getElementById('wf').classList.remove('on');
    document.getElementById('v-st').textContent='CLIQUEZ POUR ÉCOUTER';
    document.getElementById('v-ico').textContent='🎙️';
}
