# ============================================================
# PANDUAN DEPLOY ULANG DI AAPANEL
# Setelah fix better-sqlite3 & semua bug
# ============================================================

## LANGKAH-LANGKAH DI SSH AAPANEL:

```bash
# 1. Masuk ke direktori project
cd /www/wwwroot/portofolio

# 2. Pull perubahan terbaru dari GitHub
git pull origin main

# 3. Install dependencies (termasuk better-sqlite3)
npm install

# 4. Build project (WAJIB setiap kali ada perubahan)
npm run build

# 5. Restart app di aaPanel UI
#    - Buka aaPanel > Node.js > portofolio > RESTART
```

## SETTING AAPANEL (Pastikan benar):
- **Startup File:** `server.js`  
- **Port:** `3004`
- **Node Version:** v20.x

## JIKA MASIH CRASH - CEK LOG:
```bash
# Jalankan manual untuk lihat error
NODE_ENV=production node server.js
```

## CATATAN PENTING:
- `better-sqlite3` perlu dikompilasi ulang di server Linux
  Jika error `better-sqlite3: cannot find module`, jalankan:
  ```bash
  npm rebuild better-sqlite3
  ```
  
- Database file: `/www/wwwroot/portofolio/local.db`
  (otomatis dibuat saat pertama kali jalan)

## AKUN ADMIN DEFAULT:
- URL: http://domain-kamu.com:3004/admin/login
- Username: **admin**
- Password: **admin123**
