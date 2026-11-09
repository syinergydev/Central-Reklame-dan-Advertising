# Central Reklame & Advertising — Website

Website statis responsif dengan GSAP + ScrollTrigger. Paket ini dibuat sebagai deployment mandiri karena arsip yang diterima berisi foto dan logo, bukan source code website lama.

## Menjalankan secara lokal
1. Ekstrak folder proyek.
2. Buka `index.html` di browser, atau jalankan server lokal:
   - `python3 -m http.server 8000`
   - buka `http://localhost:8000`

GSAP, ScrollTrigger, dan font Geist dimuat melalui CDN; koneksi internet diperlukan untuk animasi GSAP dan font eksternal. Jika CDN tidak tersedia, konten utama tetap tampil dan fungsi galeri/filter/WhatsApp tetap berjalan.

## Deploy ke GitHub Pages / Netlify
- Upload seluruh isi folder ini ke repository GitHub.
- Untuk Netlify, pilih repository tersebut.
- Build command: kosongkan.
- Publish directory: `.` (root folder).
- Tidak memerlukan Node.js atau proses build.

## Struktur
- `index.html` — seluruh struktur halaman dan metadata SEO.
- `styles.css` — desain responsif dan motion styling.
- `script.js` — interaksi, galeri, lightbox, menu mobile, GSAP dan ScrollTrigger.
- `assets/*.webp` — versi WebP teroptimasi untuk website.
- `assets/originals/` — salinan foto JPEG asli dari arsip dan tiga unggahan terakhir.

## Catatan konten dan aset
- Logo Central Reklame berasal dari arsip yang diberikan.
- 17 foto dokumentasi dari arsip ditampilkan pada galeri.
- `IMG_2914.jpg` digunakan sebagai visual utama hero.
- Foto gedung SOFITEL dan showroom Mercedes-Benz diberi label referensi visual industri, bukan portofolio atau klaim klien Central Reklame.
- Kutipan ulasan dan alamat/nomor kontak dimasukkan sesuai informasi yang diberikan.
- Belum ada source code website lama dalam ZIP yang diterima, sehingga paket ini tidak mengubah atau menghapus file website lama.

## Sebelum publikasi
Periksa ulang ejaan alamat, nomor WhatsApp, tautan Instagram, serta embed Google Maps. Jika tersedia source website lama, halaman ini dapat diintegrasikan ke dalam struktur proyek lama.


## Pembaruan mobile dan galeri
- Galeri portofolio kini mendukung swipe horizontal native di layar sentuh.
- Tombol panah galeri berpindah satu foto per klik.
- Galeri tetap bisa digeser walaupun animasi GSAP tidak tersedia.
- Area galeri desktop mendukung drag dengan mouse.
- Layout hero, tombol, dan galeri disesuaikan untuk layar kecil.
