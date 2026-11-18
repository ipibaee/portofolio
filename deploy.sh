#!/bin/bash
# =====================================================
# AUTO DEPLOY SCRIPT - Portfolio Mu'amar Zulkifli
# Jalankan: bash deploy.sh
# =====================================================

set -e  # stop jika ada error

echo "=================================================="
echo "  DEPLOY PORTOFOLIO - Mu'amar Zulkifli"
echo "=================================================="

# Pastikan di direktori yang benar
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
echo "[1/5] Working directory: $SCRIPT_DIR"

# Pull latest dari GitHub
echo "[2/5] Git pull dari GitHub..."
git pull origin main

# Install dependencies
echo "[3/5] Install dependencies..."
npm install --production=false

# Build project
echo "[4/5] Build Next.js (webpack)..."
npm run build

echo "[5/5] Build selesai! Restart app..."

# Restart dengan PM2 jika tersedia
if command -v pm2 &> /dev/null; then
  pm2 restart portofolio 2>/dev/null || pm2 start server.js --name portofolio
  echo "✅ PM2 restart berhasil!"
else
  echo "⚠️  PM2 tidak ditemukan. Restart manual via aaPanel."
fi

echo "=================================================="
echo "  DEPLOY SELESAI!"
echo "  Buka: http://localhost:3004"
echo "  Admin: http://localhost:3004/admin"
echo "=================================================="
