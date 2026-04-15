<p align="center">
  <img src="https://imphnen.dev/logo.webp" alt="IMPHNEN Logo" width="110" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://ktik.me/logo.png" alt="ktik Logo" width="110" />
</p>

<h1 align="center">🎴 IMPHNEN - Gacha Kasta</h1>

<p align="center">
  Adu hoki. Adu kasta. Adu nasib.  
  <br/>
  Sekali klik bisa bikin lu jadi dewa… atau beban server 😈
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-active-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/made%20with-HTML%20%7C%20Tailwind%20%7C%20JS-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/fun%20level-100%25-orange?style=for-the-badge" />
</p>

<p align="center">
  👉 <b>Play Now:</b> https://imphnen.ktik.me
</p>

---

## 🎮 Tentang Project Ini

**IMPHNEN - Gacha Kasta** adalah web game ringan berbasis browser yang dibuat untuk hiburan, di mana lu bisa ngetes seberapa “tinggi kasta” digital lu hari ini.

Setiap klik tombol gacha adalah perjudian nasib:  
apakah lu bakal jadi **Open Source God**, atau malah jatuh jadi **Common (Banned)**?

Project ini dibangun dengan konsep simpel tapi nagih:
- tanpa login
- tanpa backend
- tanpa ribet
- langsung gas gacha

---

## ⚡ Kenapa Ini Seru?

- Setiap pull itu random → bikin nagih  
- Ada sistem rarity → makin langka makin flex  
- Bisa share hasil → ajak temen adu hoki  
- Ada pity system → anti apes berkepanjangan  
- UI animatif → feel kayak game beneran  

Singkatnya: **simple tapi addictive.**

---

## 🚀 Fitur Utama

- 🎰 **Gacha System**
  - UR (Ultra Rare)
  - SR (Super Rare)
  - R (Rare)
  - C (Common / Banned 😈)

- 🎯 **Pity System**
  - 10x apes = auto SR

- 🃏 **3D Card Flip Animation**
- ✨ **Visual Effects (shine + confetti)**
- 📦 **Collection System (localStorage)**
- 🔗 **Shareable Result (encoded link)**
- 📱 **Responsive Design (mobile & desktop)**

---

## 🛠️ Tech Stack

Project ini dibuat dengan pendekatan simple & cepat:

- HTML5  
- TailwindCSS (CDN)  
- Vanilla JavaScript  
- Lucide Icons  
- Canvas Confetti  

Tidak ada framework berat.  
Tidak ada build step.  
Langsung jalan.

---

## 📦 Cara Menjalankan

```bash
# cukup buka file
index.html

# atau pakai live server
````

Done. Tidak perlu install apa pun.

---

## 🎯 Cara Main

1. Masukkan nama lu
2. Klik **PULL KARTU SEKARANG**
3. Tunggu animasi gacha
4. Klik kartu untuk melihat hasil
5. Share dan pamer hasil lu 🔥

---

## 📊 Rate Gacha

| Rarity | Rate |
| ------ | ---- |
| UR     | 2%   |
| SR     | 8%   |
| R      | 30%  |
| C      | 60%  |

> Note: Ada pity system, jadi gak bakal sial terus 😏

---

## 💾 Sistem Penyimpanan

```js
localStorage: imphnen_collection
```

* Menyimpan maksimal 12 kartu terakhir
* Semua data disimpan di browser (tanpa server)
* Cepat & ringan

---

## 🔗 Share System

Lu bisa share hasil gacha ke orang lain lewat link:

```
?r=<encoded_data>
```

Contoh payload:

```json
{
  "n": "nama",
  "id": "card_id",
  "pull": "random_id"
}
```

Fungsinya:

* Orang lain bisa lihat kartu lu
* Bisa jadi ajang flex atau bahan roasting 😈

---

## ⚠️ Disclaimer

* Ini adalah **project fan-made (unofficial)**
* Dibuat untuk hiburan & eksperimen UI/UX
* Tidak ada afiliasi resmi dengan pihak mana pun
* Semua asset gambar dari sumber publik

---

## ✨ Credits

Built with chaos & caffeine ☕
Powered by 👉 [https://ktik.me](https://ktik.me)

---

<p align="center">
  dibuat bukan untuk serius  
  tapi cukup serius untuk bikin nagih 😏
</p>
