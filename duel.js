lucide.createIcons();

let myCollection = JSON.parse(localStorage.getItem('imphnen_collection')) || [];
let currentChallenger = null;
let currentChallengerCard = null;
let myCardData = null;
let myPlayerName = "BEBAN_SERVER"; 

document.addEventListener("DOMContentLoaded", () => {
    initArena();
    checkWinStreak();
});

window.onpopstate = () => initArena();

function initArena() {
    const urlParams = new URLSearchParams(window.location.search);
    const duelCodeRaw = urlParams.get('c');
    const resCodeRaw = urlParams.get('res');
    
    if (resCodeRaw) {
        if(typeof showReplay === "function") return showReplay(resCodeRaw);
    }

    document.getElementById('errorBox').classList.add('hidden');
    document.getElementById('arenaBoard').classList.remove('hidden');
    document.getElementById('fightBtn').classList.add('hidden');
    document.getElementById('lobbyBtn').classList.add('hidden');
    document.getElementById('shareResultBtn').classList.add('hidden');
    document.getElementById('actionBtn').classList.remove('hidden');
    document.getElementById('emoteContainer').classList.add('hidden');
    document.getElementById('myScoreLabel').innerText = "???";
    document.getElementById('enemyScoreLabel').innerText = "???";
    
    const myWrapper = document.getElementById('myCardWrapper');
    myWrapper.classList.add('opacity-60', 'cursor-pointer', 'hover:scale-105');
    myWrapper.onclick = openPokedex;
    
    document.getElementById('myCardInner').classList.add('is-flipped');
    document.getElementById('enemyCardInner').classList.add('is-flipped');

    if (!duelCodeRaw) {
        showErrorArena("ARENA KOSONG", "Nyasar ngab? Gak ada musuh di sini.");
        return;
    }

    let usedLinks = JSON.parse(localStorage.getItem('imphnen_used_duels')) || [];
    if (usedLinks.includes(duelCodeRaw)) {
        showErrorArena("LINK HANGUS!", "Duel ini udah pernah dimainin. Minta musuh lu generate link tantangan baru.");
        return;
    }

    try {
        currentChallenger = JSON.parse(decodeURIComponent(escape(atob(duelCodeRaw))));
        if (!currentChallenger.id) {
            showErrorArena("LINK VERSI LAMA", "Bikin link baru dari Pokedex lu ngab!");
            return;
        }

        currentChallengerCard = gachaData.find(x => x.id === currentChallenger.id);
        if(!currentChallengerCard) throw new Error("Card data lost.");

        document.getElementById('enemyNameLabel').innerText = currentChallenger.n;
        document.getElementById('mainTitle').innerHTML = `TANTANGAN DARI <span class="text-red-500">${currentChallenger.n}</span>`;
        document.getElementById('mainDesc').innerHTML = `Lawan naruh kartu dalam posisi tertutup! Tap kartu di bawah buat milih jagoan lu!`;
        
        renderSingleCard('enemy', currentChallenger.n, currentChallengerCard);
        
    } catch (error) {
        showErrorArena("LINK RUSAK", "Data tantangan gak valid.");
    }
}

function showErrorArena(title, desc) {
    document.getElementById('arenaBoard').classList.add('hidden');
    const errorBox = document.getElementById('errorBox');
    errorBox.classList.remove('hidden', 'flex'); 
    errorBox.classList.add('flex');
    document.getElementById('errorTitle').innerText = title;
    document.getElementById('errorDesc').innerText = desc;
}

function openPokedex() {
    if(myCardData) return; 
    
    const grid = document.getElementById('pokedexGrid');
    if (myCollection.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-10 text-slate-500 text-xs md:text-sm font-bold">Belum ada koleksi kartu. Balik ke Lobby buat gacha dulu ngab!</div>`;
    } else {
        grid.innerHTML = myCollection.map((c, index) => {
            const card = gachaData.find(x => x.id === c.cardId || x.title === c.title);
            const imgUrl = card ? card.image : 'https://imphnen.dev/logo.webp';
            const safeKemalasan = card ? card.kemalasan.toString().replace('%', '') + '%' : '???';
            return `
            <div onclick="selectCard(${index})" class="bg-slate-800 rounded-lg border-2 border-slate-700 hover:border-blue-500 transition-colors cursor-pointer overflow-hidden flex flex-col relative group p-1">
                <div class="holo-foil opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="h-20 md:h-28 relative overflow-hidden bg-slate-900 rounded-sm mb-1">
                    <img src="${imgUrl}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                </div>
                <div class="px-1 pb-1">
                    <p class="text-[8px] md:text-[10px] font-black text-white truncate leading-tight mb-0.5">${card ? card.title : c.title}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-[7px] md:text-[8px] font-bold text-${c.rarity.toLowerCase()}">${c.rarity}</span>
                        <span class="text-[8px] md:text-[9px] font-bold text-blue-400">${safeKemalasan}</span>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    }
    document.getElementById('pokedexModal').classList.remove('hidden');
}

function closePokedex() {
    document.getElementById('pokedexModal').classList.add('hidden');
}

function renderSingleCard(target, playerName, cardData) {
    document.getElementById(`${target}CardNameBadge`).innerText = playerName;
    document.getElementById(`${target}CardTitle`).innerText = cardData.title;
    document.getElementById(`${target}CardDesc`).innerText = cardData.desc;
    document.getElementById(`${target}CardAttack`).innerText = cardData.attack;
    
    const rarityEl = document.getElementById(`${target}CardRarityBadge`);
    if(rarityEl) rarityEl.innerText = `RARITY: ${cardData.rarity}`;
    
    const typeEl = document.getElementById(`${target}CardTypeBadge`);
    if(typeEl) typeEl.innerText = `TYPE: ${cardData.type}`;
    
    const kemalasanEl = document.getElementById(`${target}CardKemalasan`);
    if(kemalasanEl) kemalasanEl.innerText = cardData.kemalasan.toString().replace('%', '') + "%";

    const randomIdEl = document.getElementById(`${target}RandomId`);
    if(randomIdEl) randomIdEl.innerText = `ID: ${cardData.id}`;

    const img = document.getElementById(`${target}CardImage`);
    const placeholder = document.getElementById(`${target}ArtPlaceholder`);
    
    img.classList.remove('opacity-100');
    img.classList.add('opacity-0');
    if(placeholder) placeholder.classList.remove('hidden');

    img.src = cardData.image;
    img.onload = () => {
        img.classList.remove('opacity-0');
        img.classList.add('opacity-100');
        if(placeholder) placeholder.classList.add('hidden');
    };
    
    const cardFront = document.getElementById(`${target}CardFront`);
    cardFront.className = `card-front border-[6px] sm:border-[8px] flex flex-col p-1.5 sm:p-2 bg-empty border-[#334155]`;
    
    if (cardData.rarity === 'UR') { cardFront.classList.add('bg-ur', 'border-ur', 'shine-effect'); } 
    else if (cardData.rarity === 'SR') { cardFront.classList.add('bg-sr', 'border-sr', 'shine-effect'); } 
    else if (cardData.rarity === 'R') { cardFront.classList.add('bg-r', 'border-r'); } 
    else if (cardData.rarity === 'C') { cardFront.classList.add('bg-c', 'border-c'); }
}

function selectCard(index) {
    closePokedex();
    
    const c = myCollection[index];
    myPlayerName = c.name; 
    myCardData = gachaData.find(x => x.id === c.cardId || x.title === c.title);
    
    if(!myCardData) return alert("Error loading card data!");
    
    const myWrapper = document.getElementById('myCardWrapper');
    myWrapper.classList.remove('opacity-60', 'cursor-pointer', 'hover:scale-105');
    myWrapper.classList.add('opacity-100');
    myWrapper.onclick = null;

    document.getElementById('myNameLabel').innerText = myPlayerName;
    
    renderSingleCard('my', myPlayerName, myCardData);
    document.getElementById('myScoreLabel').innerText = myCardData.kemalasan.toString().replace('%', '') + "%";
    
    document.getElementById('myCardInner').classList.remove('is-flipped');
    document.getElementById('actionBtn').classList.add('hidden');
    document.getElementById('emoteContainer').classList.remove('hidden');
    
    document.getElementById('mainTitle').innerHTML = `JAGOAN TERPILIH!`;
    document.getElementById('mainDesc').innerHTML = `Si <b>${myPlayerName}</b> milih pakai <b class="text-blue-400">${myCardData.title}</b>. Jangan lupa taunting ngab!`;
    
    checkWinStreak(); // Set api kalau menang terus

    setTimeout(() => {
        document.getElementById('fightBtn').classList.remove('hidden');
    }, 500);
}

function checkWinStreak() {
    let streak = parseInt(localStorage.getItem('imphnen_winstreak')) || 0;
    const badge = document.getElementById('streakBadge');
    if(streak >= 3 && myCardData) {
        badge.classList.remove('hidden');
        badge.classList.add('flex');
        document.getElementById('streakText').innerText = `WIN STREAK: ${streak}`;
        document.getElementById('myCardFront').classList.add('streak-fire');
    } else {
        badge.classList.add('hidden');
        badge.classList.remove('flex');
        document.getElementById('myCardFront').classList.remove('streak-fire');
    }
}

// Bantuan buat render Text/Emote
function spawnFloatingText(text, x, y, isBlue = false) {
    const el = document.createElement('div');
    el.className = `damage-text ${isBlue ? 'blue' : ''}`;
    el.innerText = text;
    el.style.left = x;
    el.style.top = y;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1500);
}

function triggerEmote(target, emoji) {
    const zone = document.getElementById(`${target}EmoteZone`);
    const el = document.createElement('div');
    el.className = 'emote-float';
    el.innerText = emoji;
    // Random position dikit
    el.style.left = `${Math.random() * 40 + 30}%`; 
    el.style.bottom = `10%`;
    zone.appendChild(el);
    setTimeout(() => el.remove(), 2000);
}