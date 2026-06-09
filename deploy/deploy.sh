#!/bin/bash
# ============================================
# 恆惠紗窗網站 - Linode 部署腳本
# 用途：在 Linode 上首次設定或更新
# 用法：bash deploy.sh
# ============================================

set -e

APP_DIR="/var/www/henghui"
APP_NAME="henghui-web"

# 檢查目錄是否存在
if [ ! -d "$APP_DIR" ]; then
  echo "⚠️ $APP_DIR 不存在，請先上傳程式碼"
  exit 1
fi

cd "$APP_DIR"

echo "🚀 開始部署 ${APP_NAME}..."

# 1. 安裝相依套件
echo "📚 安裝 npm 套件"
npm ci --omit=dev

# 2. 套用 Prisma 遷移
echo "🗄️ 套用資料庫遷移"
npx prisma migrate deploy
npx prisma generate

# 3. 建立上傳目錄
echo "📁 確保上傳目錄存在"
mkdir -p public/uploads/{services,hero,avatars,og,uploads}
chmod -R 755 public/uploads

# 4. 建立 .env（若不存在）
if [ ! -f ".env" ]; then
  echo "⚠️ .env 不存在，請手動建立後重跑"
  exit 1
fi

# 5. 建立 production build
echo "🏗️ 建立 production build"
npm run build

# 6. 重新載入 PM2
echo "♻️ 重啟應用"
pm2 reload ecosystem.config.cjs 2>/dev/null || pm2 start ecosystem.config.cjs
pm2 save

echo "✅ 部署完成！"
pm2 status
