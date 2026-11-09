# Central Reklame & Advertising — Website V3

Website statis responsif dengan GSAP + ScrollTrigger, slideshow hero tiga slide, dan galeri horizontal yang menggunakan native scrolling agar interaksi sentuh tetap lancar.

## Menjalankan secara lokal
1. Ekstrak ZIP.
2. Jalankan `python3 -m http.server 8000` dari folder proyek.
3. Buka `http://localhost:8000`.

GSAP, ScrollTrigger, dan font Satoshi dimuat melalui CDN. Jika CDN tidak tersedia, seluruh konten tetap tampil; navigasi galeri, filter, lightbox, dan kontrol slideshow tetap berjalan tanpa animasi GSAP.

## Deploy ke GitHub Pages / Netlify
- Upload seluruh isi folder ini ke repository GitHub.
- Netlify publish directory: `.` (root folder).
- Build command dikosongkan.
- Tidak memerlukan Node.js atau proses build.

## Struktur
- `index.html` — struktur halaman, metadata SEO, dan seluruh konten.
- `styles.css` — desain responsif, carousel hero, native gallery scrolling, dan motion styling.
- `script.js` — state slideshow, autoplay, swipe, filter, lightbox, menu mobile, GSAP, dan ScrollTrigger.
- `assets/*.webp` — aset gambar teroptimasi.
- `assets/originals/` — salinan foto JPEG asli yang tersedia di arsip.

## Slideshow hero
Tiga visual referensi industri signage yang disertakan dalam arsip:
1. `assets/hero-state-theatre.webp` — foto gedung dengan signage vertikal bercahaya merah/putih (visual utama).
2. `assets/reference-building-signage.webp` — foto gedung SOFITEL.
3. `assets/reference-corporate-showroom.webp` — foto showroom Mercedes-Benz.

Nama file asli persis `IMG_2914.jpg`, `Sofitel-DH-5.jpg`, dan `IMG_2932.jpg` tidak tersedia dengan nama tersebut di dalam ZIP. Foto yang digunakan adalah tiga file referensi visual yang memang sudah ada di arsip, beserta salinan JPEG pada `assets/originals/`. Foto SOFITEL dan Mercedes-Benz ditandai sebagai referensi visual industri dan bukan klaim proyek atau klien Central Reklame.

## Konten yang dipertahankan
- Logo Central Reklame.
- 9 layanan.
- 17 foto dokumentasi portofolio.
- Filter Semua, Signage, Instalasi, Interior, dan Outdoor.
- Lightbox, proses pengerjaan, testimoni, rating 4,6/5 dari 18 ulasan.
- Kontak WhatsApp, Instagram, Google Maps, dan footer.

## Interaksi V3
- Slideshow memiliki tombol previous/next, indikator tiga slide, swipe, dan autoplay 5,6 detik.
- Interaksi manual menghentikan autoplay sementara sebelum dijadwalkan kembali.
- Crossfade dan subtle zoom menggunakan GSAP jika tersedia.
- Galeri menggunakan native horizontal scrolling, CSS scroll-snap, dan touch-action yang tidak mengunci swipe.
- Tombol galeri berpindah satu kartu per klik; desktop mendukung drag mouse.
- Lightbox dan filter kategori tetap aktif pada desktop maupun mobile.
- Layout disesuaikan untuk lebar 360, 375, 390, 430, tablet, dan desktop.
- `prefers-reduced-motion` dihormati.

## Catatan sebelum publikasi
Pastikan kembali tautan Instagram, alamat, serta embed Google Maps sesuai data terbaru bisnis. Website tetap menggunakan nomor WhatsApp `085746153991` dalam format tautan internasional `6285746153991`.
