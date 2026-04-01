/* ─── AI CHAT ─── */
const R={
    services:`Je propose 4 services principaux :\n\n🔹 **Applications Web & SaaS** — plateformes complètes, auth, paiements, déploiement\n🔹 **Solutions IA** — chatbots, analyse docs, génération de contenu avec Claude/Gemini\n🔹 **Automatisation** — workflows n8n, intégrations API, élimination des tâches répétitives\n🔹 **Voice AI** — assistants vocaux, agents téléphoniques IA en langage naturel\n\nChaque projet est livré en production, testé et documenté.`,
    tarifs:`Mon TJM freelance est **350€/jour**.\n\nPour projets au forfait :\n- Site vitrine avec IA : à partir de **800€**\n- Application SaaS complète : à partir de **3 000€**\n- Chatbot IA : à partir de **1 200€**\n- Automatisation workflows : à partir de **500€**\n\nDevis gratuit personnalisé sous 24h. 💬`,
    saas:`Absolument — c'est mon cœur de métier. Projets en production :\n\n✅ **AcqLead** — génération leads B2B (acqlead.fr)\n✅ **NexMétier** — conseiller IA reconversion (nexmetier.fr)\n✅ **InvestiPro** — outil OSINT analyse entreprises\n\nStack éprouvé : Next.js + Supabase + Stripe + Docker. Délai moyen : 3 à 6 semaines.`,
    delais:`Les délais selon le projet :\n\n⚡ **Site vitrine** : 1-2 semaines\n🚀 **Application SaaS** : 3-6 semaines\n🤖 **Chatbot / Solution IA** : 1-3 semaines\n🔄 **Automatisation** : 3-7 jours\n\nJe travaille vite en utilisant les bons outils. Disponible dès maintenant pour démarrer.`,
    default:`Bonne question ! Pour une réponse précise, le mieux est de me contacter directement à **admin@bizops.fr** ou via le formulaire de contact.\n\nJe réponds sous 24h et le premier échange est toujours gratuit et sans engagement. 🚀`
};
function getR(q){
    const l=q.toLowerCase();
    if(l.includes('service')||l.includes('fais')||l.includes('offre')||l.includes('propose')) return R.services;
    if(l.includes('tarif')||l.includes('prix')||l.includes('coût')||l.includes('combien')||l.includes('tjm')) return R.tarifs;
    if(l.includes('saas')||l.includes('appli')||l.includes('site')||l.includes('créer')||l.includes('creer')) return R.saas;
    if(l.includes('délai')||l.includes('temps')||l.includes('rapide')||l.includes('vite')||l.includes('quand')) return R.delais;
    return R.default;
}
function addMsg(txt,user=false){
    const c=document.getElementById('chat-msgs');
    const m=document.createElement('div'); m.className='msg '+(user?'msg-u':'msg-ai');
    if(!user){const l=document.createElement('div');l.className='m-lbl';l.textContent='IA ASSISTANT';m.appendChild(l);}
    const d=document.createElement('div');
    d.innerHTML=txt.replace(/\*\*(.*?)\*\*/g,'<strong style="color:#fff">$1</strong>').replace(/\n/g,'<br>');
    m.appendChild(d); c.appendChild(m); c.scrollTop=c.scrollHeight;
}
function showTyp(){
    const c=document.getElementById('chat-msgs');
    const t=document.createElement('div');t.className='typing';t.id='typ';
    for(let i=0;i<3;i++){const d=document.createElement('div');d.className='t-dot2';t.appendChild(d);}
    c.appendChild(t); c.scrollTop=c.scrollHeight;
}
function send(){
    const inp=document.getElementById('ci2');
    const txt=inp.value.trim(); if(!txt)return;
    inp.value=''; addMsg(txt,true); showTyp();
    setTimeout(()=>{ const t=document.getElementById('typ'); if(t)t.remove(); addMsg(getR(txt)); },700+Math.random()*900);
}
function ask(btn){ document.getElementById('ci2').value=btn.textContent; send(); }
