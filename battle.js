// ==========================================
// FILE: battle.js
// CORE GAMEPLAY LOGIC (SPELL, COUNTER, FATALITY)
// ==========================================

const sleepTime = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- 1. SYSTEM COUNTER (GUNTING BATU KERTAS) ---
// Format: "TIPE KARTU": "TIPE YANG DIKALAHKAN"
const TYPE_COUNTERS = {
    "NINJA OFFICE": "DETEKTIF",
    "SPAMMER": "SETIA",
    "QUALITY": "SPAMMER",
    "DETEKTIF": "QUALITY",
    "LURKER": "NINJA OFFICE",
    "SETIA": "LURKER",
    "SEJARAH": "DETEKTIF" // Tambahin sendiri sesuai data.js lu
};

// --- 2. SYSTEM SPELL / RNG EVENT ---
const SPELL_EVENTS = [
    {
        name: "REVISI DADAKAN",
        desc: "Ditelepon bos! Skor musuh dipotong 30%.",
        execute: (myScore, enemyScore) => { return { myNew: myScore, enemyNew: Math.floor(enemyScore * 0.7) }; }
    },
    {
        name: "KOPI SUSU WARKOP",
        desc: "Mata melek! Skor kemalasan lu nambah 50%.",
        execute: (myScore, enemyScore) => { return { myNew: Math.floor(myScore * 1.5), enemyNew: enemyScore }; }
    },
    {
        name: "MATI LAMPU",
        desc: "Server mati! Semua skor dibagi 2.",
        execute: (myScore, enemyScore) => { return { myNew: Math.floor(myScore * 0.5), enemyNew: Math.floor(enemyScore * 0.5) }; }
    },
    {
        name: "AMAN TERKENDALI",
        desc: "Gak ada yang aneh. Duel berjalan murni.",
        execute: (myScore, enemyScore) => { return { myNew: myScore, enemyNew: enemyScore }; }
    },
    {
        name: "AMAN TERKENDALI",
        desc: "Gak ada yang aneh. Duel berjalan murni.",
        execute: (myScore, enemyScore) => { return { myNew: myScore, enemyNew: enemyScore }; }
    } // Di-double biar rate 'Aman' lebih gede
];

// Variabel Global Hasil Battle
let battleResultString = "";

async function startBattle() {
    // 1. TANDAI LINK SEBAGAI HANGUS
    const urlParams = new URLSearchParams(window.location.search);
    const duelCodeRaw = urlParams.get('c');
    let usedLinks = JSON.parse(localStorage.getItem('imphnen_used_duels')) || [];
    if(!usedLinks.includes(duelCodeRaw)) {
        usedLinks.push(duelCodeRaw);
        localStorage.setItem('imphnen_used_duels', JSON.stringify(usedLinks));
    }

    document.getElementById('fightBtn').classList.add('hidden'); 
    document.getElementById('emoteContainer').classList.add('hidden'); // Sembunyiin taunting
    
    const titleEl = document.getElementById('mainTitle');
    const descEl = document.getElementById('mainDesc');
    const myWrapper = document.getElementById('myCardWrapper');
    const enemyWrapper = document.getElementById('enemyCardWrapper');
    const vsLogo = document.getElementById('vsLogo');

    let myScore = parseInt(myCardData.kemalasan.toString().replace('%', ''));
    let enemyScore = parseInt(currentChallengerCard.kemalasan.toString().replace('%', ''));

    // PHASE 1: MUSUH BUKA KARTU
    titleEl.innerHTML = `⚠️ MUSUH MEMBALAS!`;
    descEl.innerHTML = `Dia pakai <b class="text-red-400">${currentChallengerCard.title}</b>!`;
    
    document.getElementById('enemyCardInner').classList.remove('is-flipped');
    document.getElementById('enemyScoreLabel').innerText = enemyScore + "%";

    await sleepTime(2000);

    // PHASE 2: SPELL / RNG EVENT
    titleEl.innerHTML = `🎲 MENGUNDI TAKDIR...`;
    descEl.innerHTML = `Sistem lagi nyari gara-gara...`;
    
    // Gacha Event
    const randomEvent = SPELL_EVENTS[Math.floor(Math.random() * SPELL_EVENTS.length)];
    
    if (randomEvent.name !== "AMAN TERKENDALI") {
        await sleepTime(500);
        const modal = document.getElementById('eventModal');
        document.getElementById('eventName').innerText = randomEvent.name;
        document.getElementById('eventDesc').innerText = randomEvent.desc;
        modal.classList.add('show');
        
        // Update Score Based on Event
        const newScores = randomEvent.execute(myScore, enemyScore);
        myScore = newScores.myNew;
        enemyScore = newScores.enemyNew;
        
        await sleepTime(2500);
        modal.classList.remove('show');
        
        // Animasi angka berubah
        document.getElementById('myScoreLabel').innerText = myScore + "%";
        document.getElementById('myScoreLabel').classList.add('text-yellow-400');
        document.getElementById('enemyScoreLabel').innerText = enemyScore + "%";
        document.getElementById('enemyScoreLabel').classList.add('text-yellow-400');
        await sleepTime(1000);
    }

    // PHASE 3: TENSION & COUNTER ELEMENT CHECK
    titleEl.innerHTML = `⚡ CLASH!`;
    descEl.innerHTML = `Kedua beban bersiap adu mekanik!`;
    
    enemyWrapper.classList.add('pull-back-enemy', 'shake-intense');
    myWrapper.classList.add('pull-back-player', 'shake-intense');

    let counterMsg = "";
    const myType = myCardData.type.toUpperCase();
    const enemyType = currentChallengerCard.type.toUpperCase();

    if (TYPE_COUNTERS[myType] === enemyType) {
        counterMsg = `SUPER EFFECTIVE! Tipe ${myType} nge-counter ${enemyType}!`;
        myScore = Math.floor(myScore * 1.5);
    } else if (TYPE_COUNTERS[enemyType] === myType) {
        counterMsg = `AWAS! Tipe ${enemyType} musuh nge-counter lu!`;
        enemyScore = Math.floor(enemyScore * 1.5);
    }

    if (counterMsg !== "") {
        await sleepTime(1000);
        titleEl.innerHTML = `💥 CRITICAL!`;
        descEl.innerHTML = `<b class="text-orange-400">${counterMsg}</b>`;
        document.getElementById('myScoreLabel').innerText = myScore + "%";
        document.getElementById('enemyScoreLabel').innerText = enemyScore + "%";
    }
    
    await sleepTime(1500); 

    // PHASE 4: DASH & IMPACT!
    enemyWrapper.classList.remove('pull-back-enemy', 'shake-intense');
    myWrapper.classList.remove('pull-back-player', 'shake-intense');
    
    enemyWrapper.classList.add('dash-center-enemy');
    myWrapper.classList.add('dash-center-player');
    vsLogo.classList.add('scale-0', 'opacity-0'); 
    
    await sleepTime(150); 
    
    // IMPACT GEMPA
    document.body.classList.add('screen-shake');
    
    const flash = document.getElementById('flashBang');
    flash.style.background = 'radial-gradient(circle, rgba(255,234,0,1) 0%, rgba(255,0,0,1) 100%)';
    flash.classList.add('flash-active');
    
    spawnFloatingText(enemyScore + "%", '40%', '30%', false);
    spawnFloatingText(myScore + "%", '60%', '60%', true);
    
    confetti({ particleCount: 200, spread: 360, origin: { x: 0.5, y: 0.5 }, startVelocity: 40, colors: ['#ff0000', '#ffff00', '#ff8c00'] });

    await sleepTime(200);
    flash.classList.remove('flash-active');
    
    await sleepTime(500);
    document.body.classList.remove('screen-shake');
    enemyWrapper.classList.remove('dash-center-enemy');
    myWrapper.classList.remove('dash-center-player');
    vsLogo.classList.remove('scale-0', 'opacity-0');
    
    await sleepTime(600);

    // PHASE 5: HASIL & FATALITY
    let winStreak = parseInt(localStorage.getItem('imphnen_winstreak')) || 0;
    const scoreDiff = Math.abs(myScore - enemyScore);
    const isFatality = scoreDiff >= 80;

    if (myScore > enemyScore) {
        winStreak++;
        localStorage.setItem('imphnen_winstreak', winStreak);
        
        if (isFatality) {
            titleEl.innerHTML = `🔥 FATALITY!`;
            descEl.innerHTML = `Musuh lenyap tak bersisa! Beda skor kejauhan!`;
            enemyWrapper.classList.add('fatality-explode');
        } else {
            titleEl.innerHTML = `🎉 ${myPlayerName.toUpperCase()} MENANG!`;
            descEl.innerHTML = `Lu sukses membuktikan diri sebagai beban mutlak!`;
            enemyWrapper.classList.add('grayscale', 'opacity-50', 'scale-90');
        }
        
        document.getElementById('myCardFront').classList.add('shine-effect');
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }, colors: ['#3b82f6', '#ffffff'] });
        
        battleResultString = `🔥 BOOYAH! Gue barusan ngebantai si ${currentChallenger.n} di Arena IMPHNEN!\nJagoan gue [${myCardData.title}] sukses ngancurin [${currentChallengerCard.title}].\n\nWin Streak gue: ${winStreak}x! Siapa berani patahin?\nNih tonton replay perangnya:`;
    } 
    else if (enemyScore > myScore) {
        localStorage.setItem('imphnen_winstreak', 0); // Reset streak

        if (isFatality) {
            titleEl.innerHTML = `💀 OBLITERATED!`;
            descEl.innerHTML = `Kartu lu jadi abu! Si ${currentChallenger.n} menang telak.`;
            myWrapper.classList.add('fatality-explode');
        } else {
            titleEl.innerHTML = `💀 ${myPlayerName.toUpperCase()} TERBANTAI!`;
            descEl.innerHTML = `Sisa HP lu 0! Si ${currentChallenger.n} emang raja mager sejati.`;
            myWrapper.classList.add('grayscale', 'opacity-50', 'scale-90');
        }

        document.getElementById('enemyCardFront').classList.add('shine-effect');
        
        battleResultString = `💀 SIALAN! Gue dibantai habis-habisan sama si ${currentChallenger.n} di Arena IMPHNEN.\nKartu [${myCardData.title}] gue gak berkutik ngelawan [${currentChallengerCard.title}].\n\nTonton rekaman kekalahan gue di sini:`;
    } 
    else {
        localStorage.setItem('imphnen_winstreak', 0);
        titleEl.innerHTML = `🤝 DRAW!`;
        descEl.innerHTML = `Sama-sama ampas! Kekuatan kalian berdua seimbang.`;
        battleResultString = `🤝 DRAW KOCAK! Duel gue ngelawan si ${currentChallenger.n} seri.\nSama-sama ampas pakai kartu [${myCardData.title}] vs [${currentChallengerCard.title}].\n\nTonton replay kocaknya di sini:`;
    }

    setTimeout(() => {
        document.getElementById('shareResultBtn').classList.remove('hidden');
        document.getElementById('lobbyBtn').classList.remove('hidden');
    }, 1500);
}

function shareDuelResult() {
    let urlTarget = window.location.href.split('?')[0]; 

    // Generate Share Code Replay Result
    // e = enemy, m = my (player)
    const payload = { 
        e: { n: currentChallenger.n, id: currentChallengerCard.id, s: document.getElementById('enemyScoreLabel').innerText },
        m: { n: myPlayerName, id: myCardData.id, s: document.getElementById('myScoreLabel').innerText }
    };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    
    const finalUrl = urlTarget + "?res=" + encoded;
    const text = battleResultString;

    if (navigator.share) {
        navigator.share({ title: 'Hasil Duel IMPHNEN', text: text, url: finalUrl });
    } else {
        navigator.clipboard.writeText(text + "\n" + finalUrl);
        alert("Link Replay duel berhasil disalin! Paste linknya di tab baru buat nonton ngab!");
    }
}

// ==== FUNGSI REPLAY DARI SHARE ====
async function showReplay(resCodeRaw) {
    try {
        const data = JSON.parse(decodeURIComponent(escape(atob(resCodeRaw))));
        
        const enemyCard = gachaData.find(x => x.id === data.e.id);
        const myCard = gachaData.find(x => x.id === data.m.id);
        
        if(!enemyCard || !myCard) throw new Error("Card missing");

        document.getElementById('errorBox').classList.add('hidden');
        document.getElementById('arenaBoard').classList.remove('hidden');
        document.getElementById('actionBtn').classList.add('hidden');
        document.getElementById('fightBtn').classList.add('hidden');
        document.getElementById('shareResultBtn').classList.add('hidden'); 
        
        // Render Musuh
        document.getElementById('enemyNameLabel').innerText = data.e.n;
        if(typeof renderSingleCard === "function") renderSingleCard('enemy', data.e.n, enemyCard);
        document.getElementById('enemyScoreLabel').innerText = data.e.s;
        document.getElementById('enemyCardInner').classList.remove('is-flipped');
        
        // Render Player
        const myWrapper = document.getElementById('myCardWrapper');
        myWrapper.classList.remove('opacity-60', 'cursor-pointer', 'hover:scale-105');
        myWrapper.classList.add('opacity-100');
        myWrapper.onclick = null;
        
        document.getElementById('myNameLabel').innerText = data.m.n.toUpperCase();
        document.getElementById('myScoreLabel').innerText = data.m.s;
        if(typeof renderSingleCard === "function") renderSingleCard('my', data.m.n, myCard);
        document.getElementById('myCardInner').classList.remove('is-flipped');

        const titleEl = document.getElementById('mainTitle');
        const descEl = document.getElementById('mainDesc');
        const enemyWrapper = document.getElementById('enemyCardWrapper');
        
        let mScoreNum = parseInt(data.m.s.replace('%', ''));
        let eScoreNum = parseInt(data.e.s.replace('%', ''));

        if (mScoreNum > eScoreNum) {
            titleEl.innerHTML = `🎉 ${data.m.n.toUpperCase()} MENANG!`;
            descEl.innerHTML = `Si ${data.m.n} sukses ngebantai ${data.e.n} di arena!`;
            enemyWrapper.classList.add('grayscale', 'opacity-50', 'scale-90');
            document.getElementById('myCardFront').classList.add('shine-effect');
        } else if (eScoreNum > mScoreNum) {
            titleEl.innerHTML = `💀 ${data.m.n.toUpperCase()} TERBANTAI!`;
            descEl.innerHTML = `Si ${data.e.n} berhasil ngancurin ${data.m.n}!`;
            myWrapper.classList.add('grayscale', 'opacity-50', 'scale-90');
            document.getElementById('enemyCardFront').classList.add('shine-effect');
        } else {
            titleEl.innerHTML = `🤝 DRAW!`;
            descEl.innerHTML = `Kekuatan ${data.m.n} dan ${data.e.n} seimbang.`;
        }

        const lobbyBtn = document.getElementById('lobbyBtn');
        lobbyBtn.classList.remove('hidden');
        lobbyBtn.innerHTML = `<i data-lucide="swords" class="w-4 h-4 md:w-5 md:h-5"></i> BIKIN TANTANGAN BARU!`;
        lobbyBtn.onclick = () => window.location.href = 'index.html';

        lucide.createIcons();
    } catch(e) {
        document.getElementById('arenaBoard').classList.add('hidden');
        const errorBox = document.getElementById('errorBox');
        errorBox.classList.remove('hidden', 'flex'); 
        errorBox.classList.add('flex');
        document.getElementById('errorTitle').innerText = "REPLAY RUSAK";
        document.getElementById('errorDesc').innerText = "Data hasil duel udah expired atau gak valid.";
    }
}