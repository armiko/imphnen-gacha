<p align="center">
  <img src="https://imphnen.dev/logo.webp" alt="IMPHNEN Logo" width="110" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://ktik.me/logo.png" alt="ktik Logo" width="110" />
</p>

<h1 align="center">🎴 IMPHNEN - Gacha & Arena Duel</h1>

<p align="center">
  Adu hoki. Adu mekanik.  
  <br/>
  Sekali klik bisa bikin lu jadi dewa… atau beban server 😈
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-active-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/made%20with-HTML%20%7C%20Tailwind%20%7C%20JS-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/fun%20level-1000%25-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/RNG-Chaos-red?style=for-the-badge" />
</p>

<p align="center">
  👉 <b>Play Now:</b> <a href="https://imphnen.ktik.me">https://imphnen.ktik.me</a>
</p>

---

## 🎮 Tentang Project Ini

**IMPHNEN - Gacha** adalah web game TCG (Trading Card Game) ringan berbasis browser yang dibuat untuk hiburan. Di sini lu gak cuma ngetes seberapa “tinggi hoki” lu lewat sistem gacha, tapi lu juga bisa pamer dan ngajak duel kartu lu buat ngebantai temen.

Setiap klik tombol gacha adalah perjudian nasib:  
apakah lu bakal jadi **Open Source God**, atau malah jatuh jadi **Common** yang hancur lebur di arena duel?

Project ini dibangun dengan konsep simpel tapi nagih:
- tanpa login
- tanpa database backend (100% Client-Side & Base64 Sharing)
- tanpa ribet
- langsung gas gacha & duel!

---

## ⚡ Kenapa Ini Seru?

- Setiap *pull* itu random → bikin nagih.
- Ada sistem *rarity* → makin langka makin flex, lengkap dengan efek *holo foil* nyala.
- **Arena Duel TCG** → Bisa pamer hasil *pull* lu sekalian adu mekanik.
- Ada sistem RNG (Kartu Sihir) & Element Counter → Kartu ampas bisa menang lawan kartu dewa kalau hokinya lagi bagus.
- Bisa share *replay* pertempuran lu ke temen lewat link ajaib.
- *Simple tapi addictive.*

---

## 🚀 Fitur Utama

### 🎰 Fase 1: Gacha & Koleksi
- **Gacha System Berjenjang**
  - UR (Ultra Rare)
  - SR (Super Rare)
  - R (Rare)
  - C (Common)
- **Pity System:** 10x apes berturut-turut = auto garansi dapet kartu SR ke atas.
- **Pokedex System:** Simpan dan lihat ulang histori kartu gacha lu lewat modal interaktif.

### ⚔️ Fase 2: Arena Duel
- **Shareable Duel Link:** Tantang temen lu pakai kartu jagoan lu langsung dari Pokedex (dilengkapi fitur anti-spam/link hangus).
- **RNG Spell Events:** Sebelum tabrakan skor, sistem mengundi "Kartu Sihir" dadakan (Mati Lampu, Revisi, Kopi Susu) yang bisa merubah skor lu secara drastis!
- **Counter Element System:** Tipe kartu saling *counter* (Gunting-Batu-Kertas). Tipe kartu yang menang akan dapat *Critical Boost Damage*.
- **Share Replay:** Pamer hasil duel (menang, kalah, atau hancur lebur) lewat link Base64 yang memutar ulang detik-detik tabrakannya.

---

## 🛠️ Tech Stack

Project ini dibuat dengan pendekatan modular, rapi, ringan & secepat kilat:

- **HTML5 & CSS3** (Custom 3D Flip Animations, Shimmering Holo Foil, Screen Shake)
- **TailwindCSS** (CDN)
- **Vanilla JavaScript** (Data, UI Logic, & Battle Engine Dipisah)
- **LocalStorage API** (Simpan Pokedex & Win Streak)
- **Base64 URL Encoding** (Sistem Share & Replay tanpa Backend)
- **Lucide Icons & Canvas Confetti**

Tidak ada framework berat.  
Tidak ada build step.  
Langsung jalan.

---

## 📦 Struktur File & Cara Menjalankan

Project ini telah dipisah menjadi beberapa modul agar mudah dikembangkan:

- `index.html` & `script.js` → UI Utama, Gacha Logic, & Pokedex.
- `duel.html` & `duel.js` → UI Arena Duel, Animasi Kartu, & Replay Engine.
- `battle.js` → Core Gameplay Engine (Spell RNG, Element Counter).
- `data.js` → Database JSON kumpulan kartu IMPHNEN.
- `style.css` → Global styling tambahan.

### Local Development
```bash
# 1. Clone repository ini ke lokal lu.
# 2. Buka folder project di VS Code.
# 3. Jalankan pakai ekstensi "Live Server".
# Atau lu juga bisa langsung drag & drop file index.html ke browser kesayangan lu.
# Gak perlu install package npm apa-apa!
