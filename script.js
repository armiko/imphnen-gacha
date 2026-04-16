lucide.createIcons();

let pullCount = 0;
let commonStreak = 0;
let isRolling = false;
let currentShareData = null; 
let myCollection = JSON.parse(localStorage.getItem('imphnen_collection')) || [];

document.addEventListener("DOMContentLoaded", () => {
    checkShareLink();
});

function flipCard() {
    if (isRolling) return;
    document.getElementById('cardInner').classList.toggle('is-flipped');
}

function checkShareLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const shareCode = urlParams.get('r');
    
    if (shareCode) {
        try {
            const decoded = JSON.parse(decodeURIComponent(escape(atob(shareCode))));
            document.getElementById('statusBadge').innerHTML = `👀 Mengintip Kartu Seseorang`;
            document.getElementById('mainTitle').innerHTML = `Kartu Gacha <br/> <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-600 to-purple-600">si ${decoded.n}</span>`;
            document.getElementById('mainDesc').innerText = "Apakah lu bisa dapet kartu yang lebih langka dari dia? Adu hoki lu sekarang!";
            
            document.getElementById('inputGroup').classList.add('hidden');
            
            const btn = document.getElementById('gachaBtn');
            document.getElementById('btnText').innerText = `TES HOKI LU SENDIRI!`;
            document.getElementById('btnIconWrapper').innerHTML = `<i data-lucide="dices" class="w-6 h-6 animate-bounce"></i>`;
            btn.onclick = () => { window.location.href = window.location.pathname; };

            let item = gachaData.find(x => x.id === decoded.id) || gachaData[gachaData.length-1];
            updateCardUI(decoded.n, item, decoded.pull);
            document.getElementById('cardInner').classList.remove('is-flipped');
            document.getElementById('shareActionContainer').classList.remove('hidden');
            document.getElementById('flipHint').classList.remove('hidden');
        } catch (error) { console.log("Invalid share link."); }
    }
}

function prepareGacha() {
    if (isRolling) return;
    const nameInput = document.getElementById('playerName').value.trim();
    if (!nameInput) {
        const inputEl = document.getElementById('playerName');
        inputEl.classList.add('border-red-500', 'translate-x-1');
        setTimeout(() => inputEl.classList.remove('border-red-500', 'translate-x-1'), 300);
        return;
    }

    isRolling = true;
    
    const btn = document.getElementById('gachaBtn');
    btn.disabled = true;
    document.getElementById('btnText').innerText = `MENGUNDI TAKDIR...`;
    document.getElementById('btnIconWrapper').innerHTML = `<i data-lucide="loader-2" class="w-6 h-6 animate-spin"></i>`;
    document.getElementById('shareActionContainer').classList.add('hidden');
    document.getElementById('epicAura').className = 'epic-aura';
    document.getElementById('flipHint').classList.add('hidden');

    const cardInner = document.getElementById('cardInner');
    cardInner.classList.add('is-flipped'); 
    
    const wrapper = document.getElementById('cardWrapperMain');
    wrapper.classList.add('anim-rolling');
    
    setTimeout(() => executeGachaLogic(nameInput), 2500);
}

function executeGachaLogic(playerName) {
    pullCount++;
    let resultItem;
    const rand = Math.random() * 100;

    if (commonStreak >= 10) {
        const srPool = gachaData.filter(x => x.rarity === "SR");
        resultItem = srPool[Math.floor(Math.random() * srPool.length)];
        commonStreak = 0;
    } else if (rand <= 2) { 
        const urPool = gachaData.filter(x => x.rarity === "UR");
        resultItem = urPool[Math.floor(Math.random() * urPool.length)]; 
        commonStreak = 0; 
    } else if (rand <= 10) { 
        const srPool = gachaData.filter(x => x.rarity === "SR");
        resultItem = srPool[Math.floor(Math.random() * srPool.length)]; 
        commonStreak = 0; 
    } else if (rand <= 40) { 
        const rPool = gachaData.filter(x => x.rarity === "R");
        resultItem = rPool[Math.floor(Math.random() * rPool.length)]; 
        commonStreak = 0; 
    } else { 
        const cPool = gachaData.filter(x => x.rarity === "C");
        resultItem = cPool[Math.floor(Math.random() * cPool.length)]; 
        commonStreak++; 
    }

    const pullId = Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
    
    triggerEpicReveal(playerName, resultItem, pullId);
}

function triggerEpicReveal(playerName, item, pullId) {
    const flash = document.getElementById('flashBang');
    flash.classList.add('is-flashing');

    setTimeout(() => {
        document.getElementById('cardWrapperMain').classList.remove('anim-rolling');
        
        updateCardUI(playerName, item, pullId);
        saveToCollection(playerName, item, pullId);

        document.getElementById('cardInner').classList.remove('is-flipped');
        flash.classList.remove('is-flashing');

        triggerEpicConfetti(item.rarity);
        
        setTimeout(() => {
            document.getElementById('shareActionContainer').classList.remove('hidden');
            document.getElementById('flipHint').classList.remove('hidden');
            resetButton();
        }, 500);

    }, 200);
}

function triggerEpicConfetti(rarity) {
    const aura = document.getElementById('epicAura');
    if (rarity === "UR") {
        aura.className = 'epic-aura aura-ur';
        const duration = 3000;
        const end = Date.now() + duration;
        (function frame() {
            confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors: ['#FFDF00', '#D4AF37', '#ffffff'] });
            confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors: ['#FFDF00', '#D4AF37', '#ffffff'] });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    } else if (rarity === "SR") {
        aura.className = 'epic-aura aura-sr';
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }, colors: ['#FF00FF', '#8A2BE2', '#ffffff'] });
    } else if (rarity === "R") {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 }, colors: ['#00FFFF', '#1E90FF'] });
    } else {
        confetti({ particleCount: 30, spread: 40, origin: { y: 0.6 }, colors: ['#94A3B8'] });
    }
}

function updateCardUI(playerName, item, pullId) {
    currentShareData = { n: playerName, id: item.id, pull: pullId };

    document.getElementById('cardNameBadge').innerText = playerName;
    document.getElementById('cardKemalasan').innerText = item.kemalasan;
    document.getElementById('cardTitle').innerText = item.title;
    document.getElementById('cardAttack').innerText = item.attack;
    document.getElementById('cardDesc').innerText = item.desc;
    document.getElementById('randomId').innerText = `ID: ${pullId}`;
    document.getElementById('cardTypeBadge').innerText = `Type: ${item.type}`;
    document.getElementById('pullCountDisplay').innerText = pullCount;
    document.getElementById('pityDisplay').innerText = `${commonStreak}/10`;

    const cardFront = document.getElementById('cardFront');
    cardFront.className = `card-front border-[8px] sm:border-[10px] flex flex-col p-2 sm:p-3 bg-${item.rarity.toLowerCase()} border-${item.rarity.toLowerCase()} shine-effect`;
    document.getElementById('cardRarityBadge').innerText = `Rarity: ${item.rarity}`;

    const img = document.getElementById('cardImage');
    const placeholder = document.getElementById('artPlaceholder');
    img.src = item.image;
    img.onload = () => { img.classList.replace('opacity-0', 'opacity-100'); placeholder.classList.add('hidden'); };
    lucide.createIcons();
}

function resetButton() {
    isRolling = false;
    const btn = document.getElementById('gachaBtn');
    document.getElementById('btnText').innerText = `PULL KARTU LAGI`;
    document.getElementById('btnIconWrapper').innerHTML = `<i data-lucide="zap" class="w-6 h-6"></i>`;
    btn.disabled = false;
    lucide.createIcons();
}

function saveToCollection(name, item, pullId) {
    // Menambahkan properti cardId buat lookup ke pokedex
    const entry = { name, rarity: item.rarity, title: item.title, id: pullId, cardId: item.id, date: new Date().toLocaleDateString() };
    myCollection.unshift(entry);
    // Tambah limit pokedex dari 12 ke 50 biar bisa nabung banyak
    if(myCollection.length > 50) myCollection.pop();
    localStorage.setItem('imphnen_collection', JSON.stringify(myCollection));
}

// ================= LOGIC POKEDEX =================
function openPokedex() {
    renderPokedex();
    document.getElementById('pokedexModal').classList.remove('hidden');
}

function closePokedex() {
    document.getElementById('pokedexModal').classList.add('hidden');
}

function renderPokedex() {
    const grid = document.getElementById('pokedexGrid');
    if (myCollection.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-10 text-slate-500 font-bold">Belum ada koleksi kartu. Ayo gacha dulu ngab!</div>`;
        return;
    }

    grid.innerHTML = myCollection.map((c, index) => {
        // Fallback untuk history lama (yang belum punya cardId di localStorage)
        const cardData = gachaData.find(x => x.id === c.cardId || x.title === c.title);
        const imgUrl = cardData ? cardData.image : 'https://imphnen.dev/logo.webp';

        return `
        <div onclick="viewPokedexItem(${index})" class="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer overflow-hidden flex flex-col relative group">
            <div class="h-28 bg-slate-800 relative overflow-hidden">
                <img src="${imgUrl}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
                <div class="absolute top-1 right-1 bg-slate-900/80 px-1.5 py-0.5 rounded text-[8px] font-black text-white border border-white/20">${c.rarity}</div>
            </div>
            <div class="p-2 flex-1 flex flex-col justify-between">
                <div>
                    <p class="text-[9px] text-slate-400 font-mono mb-0.5">${c.id}</p>
                    <p class="text-[11px] font-black leading-tight text-slate-800 line-clamp-1">${c.title}</p>
                    <p class="text-[9px] text-primary font-bold truncate mt-0.5">${c.name}</p>
                </div>
                <div class="mt-2 pt-2 border-t border-slate-100 text-[9px] text-slate-500 text-center font-bold flex items-center justify-center gap-1 group-hover:text-primary transition-colors">
                    <i data-lucide="eye" class="w-3.5 h-3.5"></i> LIHAT
                </div>
            </div>
        </div>
        `;
    }).join('');
    lucide.createIcons();
}

function viewPokedexItem(index) {
    const c = myCollection[index];
    const item = gachaData.find(x => x.id === c.cardId || x.title === c.title);
    if(!item) {
        alert('Data kartu gagal dimuat.');
        return;
    }

    // 1. Tutup modal Pokedex
    closePokedex();

    // 2. Tampilkan UI Kartu ke Main Display
    updateCardUI(c.name, item, c.id);
    
    // 3. Posisikan agar kartu tampak depan
    document.getElementById('cardInner').classList.remove('is-flipped');
    
    // 4. Munculkan container share dan hint flip
    document.getElementById('shareActionContainer').classList.remove('hidden');
    document.getElementById('flipHint').classList.remove('hidden');

    // 5. Scroll otomatis ke arah kartu
    document.getElementById('cardWrapperMain').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function shareResultAPI() {
    if(!currentShareData) return;
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(currentShareData))));
    const url = window.location.origin + window.location.pathname + "?r=" + encoded;
    const text = `Gue dapet kartu [${currentShareData.id}] di TCG Gacha IMPHNEN! Cek kasta lu di mari:`;

    if (navigator.share) {
        navigator.share({ title: 'Gacha Kasta IMPHNEN', text: text, url: url });
    } else {
        navigator.clipboard.writeText(text + " " + url);
        alert("Link Berhasil Disalin!");
    }
}