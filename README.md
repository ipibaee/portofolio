# Portofolio Interaktif & Modern - Mu'amar Zulkifli (IPIPortofolio)

Website portofolio generasi baru dengan desain futuristik, interaktif, responsif mobile, dan dilengkapi **Panel Admin Lengkap (CRUD)** untuk mengelola isi profil, keahlian, layanan, serta projek-projek seperti aplikasi servis motor **Motocare**, toko e-commerce, dan lainnya.

---

## ✨ Fitur Unggulan

- **Animasi & Interaktivitas Mouse Modern:**
  - *Custom Trailing Cursor Follower:* Efek kursor bercahaya yang mengikuti gerakan mouse secara halus dengan akselerasi cerdas.
  - *Interactive Starfield Canvas:* Partikel latar belakang yang dinamis merespons posisi mouse (garis konstelasi bercahaya dan efek tolak/tarik halus).
  - *3D Tilt Cards:* Kartu projek dan kartu profil yang memiliki efek kemiringan 3D dan kilauan cahaya (*glare sheen*) saat dijelajahi kursor.
  - *Dynamic Typing Effect:* Teks berganti otomatis (*Designer, Developer, Freelancer, Photographer*).
- **Akses Langsung Projek (Motocare, dll):**
  - Tombol pintas projek unggulan di navbar dan banner beranda.
  - Filter kategori projek (Web App, Website, Design).
  - Modal detail projek interaktif beserta tautan Live Demo dan GitHub Repository.
- **Panel Admin Terintegrasi (`/admin`):**
  - Otentikasi aman berbasis JWT & BCrypt.
  - **Default Akun:** Username `admin` | Password `admin123` (dapat diubah di menu Pengaturan).
  - **CRUD Projek:** Tambah, edit, dan hapus data projek, link demo Motocare, gambar, tag, dan status unggulan.
  - **CRUD Tombol Menu Pintas:** Tambah/edit tombol langsung ke projek yang muncul di bar navigasi.
  - **CRUD Skills, Edukasi, dan Layanan:** Semua isi web dapat dikustomisasi tanpa perlu mengubah kode.
  - **Kotak Masuk Pesan:** Membaca pesan yang dikirimkan oleh pengunjung melalui formulir kontak.
  - **Unggah Gambar Langsung:** Fitur upload screenshot projek dan foto profil via API.
- **Desain Responsif Mobile-First:**
  - Tampilan mulus dan nyaman diakses dari smartphone, tablet, maupun monitor desktop resolusi tinggi.
  - Mobile drawer navigation dengan efek frosted glass.
- **Kesiapan Deploy aaPanel & GitHub:**
  - Database bawaan SQLite (`local.db`) bebas konfigurasi tambahan, auto-seed saat pertama kali dijalankan.
  - Mendukung PostgreSQL/Neon Database via variabel `DATABASE_URL` jika diinginkan.
  - Panduan lengkap auto-deploy via GitHub Webhook di [DEPLOY_AAPANEL.md](DEPLOY_AAPANEL.md).

---

## 🛠️ Menjalankan di Lokal (Development)

```bash
# 1. Install dependensi
npm install

# 2. Jalankan server dev
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.  
Panel Admin tersedia di [http://localhost:3000/admin](http://localhost:3000/admin).

---

## 🚀 Build & Production

```bash
npm run build
npm run start
```
