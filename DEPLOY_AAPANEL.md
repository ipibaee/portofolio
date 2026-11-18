# Panduan Deploy Otomatis Portofolio ke aaPanel dari GitHub

Projek portofolio ini dibangun menggunakan **Next.js modern**, **Tailwind CSS**, dan **SQLite database** bawaan (menggunakan `@libsql/client`), sehingga sangat ringan, cepat, dan **langsung berjalan di VPS aaPanel tanpa perlu setting database MySQL terpisah**.

---

## 1. Akun Admin Bawaan (Default)
Setelah website berjalan, Anda dapat mengelola seluruh konten dan projek (seperti Motocare, web toko, dll):
- **URL Admin Panel:** `https://domain-anda.com/admin` (atau `/admin/login`)
- **Username:** `admin`
- **Password Default:** `admin123`
- *Catatan: Anda dapat langsung mengganti username dan password ini kapan saja melalui menu **"Ganti Password Admin"** di dalam dashboard admin.*

---

## 2. Cara Pasang di aaPanel (Node Project Manager)

1. **Buka aaPanel Anda:**
   - Masuk ke menu **App Store** di aaPanel.
   - Pastikan telah menginstal **Node.js Version Manager** (atau **PM2 Manager**).
   - Install versi Node.js **v20.x** atau **v18.x** (disarankan v20 LTS).

2. **Clone Repository ke aaPanel:**
   - Masuk ke menu **Terminal** di aaPanel (atau via SSH).
   - Masuk ke direktori web:
     ```bash
     cd /www/wwwroot
     git clone https://github.com/ipibaee/portofolio.git portofolio
     cd portofolio
     npm install
     npm run build
     ```

3. **Buat Node Project di Menu aaPanel:**
   - Masuk ke menu **Website** -> **Node project** -> klik **Add Node project**.
   - **Project Name:** `portofolio`
   - **Path:** `/www/wwwroot/portofolio`
   - **Run Opt:** `npm run start` (atau gunakan start script bawaan Next.js)
   - **Port:** `3000` (atau port kosong lainnya)
   - **Domain:** Masukkan domain portofolio Anda (misalnya `ipibaee.com` atau subdomain).
   - Klik **Submit**.

4. **Pasang SSL (HTTPS Gratis):**
   - Di daftar website Node project, klik domain Anda -> masuk ke tab **SSL**.
   - Pilih tab **Let's Encrypt**, centang domain Anda, dan klik **Apply**.

---

## 3. Setup Auto Deploy Otomatis (GitHub Webhook)

Agar setiap kali Anda melakukan update kode atau `git push` ke GitHub, website di aaPanel langsung terupdate otomatis:

1. **Install Plugin WebHook di aaPanel:**
   - Buka **App Store** di aaPanel -> Cari **WebHook** -> Klik **Install**.

2. **Buat Task Webhook Baru di aaPanel:**
   - Buka plugin **WebHook** -> Klik **Add**.
   - **Title:** `Deploy Portofolio`
   - **Script:** Masukkan script shell berikut:
     ```bash
     #!/bin/bash
     echo "Starting Auto Deploy Portofolio..."
     cd /www/wwwroot/portofolio
     
     # Tarik kode terbaru dari GitHub
     git fetch --all
     git reset --hard origin/main
     git pull origin main
     
     # Install dependensi dan build
     npm install
     npm run build
     
     # Restart node project via PM2 / aaPanel
     pm2 reload portofolio || pm2 restart portofolio || npm run start &
     
     echo "Deploy Selesai dengan Sukses!"
     ```
   - Klik **Submit**.
   - Setelah tersimpan, klik tombol **View Key / URL** pada task webhook tersebut. Salin WebHook Link yang diberikan (contoh: `http://ip-vps:8888/hook?access_key=...&params=...`).

3. **Pasang WebHook URL di GitHub:**
   - Buka repositori Anda di GitHub: `https://github.com/ipibaee/portofolio`
   - Klik tab **Settings** -> pilih menu **Webhooks** di sebelah kiri.
   - Klik tombol **Add webhook**.
   - **Payload URL:** Paste Webhook URL yang Anda salin dari aaPanel tadi.
   - **Content type:** Pilih `application/json`.
   - **Which events would you like to trigger this webhook?** Pilih `Just the push event`.
   - Klik **Add webhook**.

Selesai! Sekarang setiap kali Anda push kode ke GitHub, aaPanel akan otomatis menarik pembaruan dan memperbarui website Anda secara otomatis.
