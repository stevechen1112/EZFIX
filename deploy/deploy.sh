#!/bin/bash
# 恆惠紗窗網站 - 部署腳本（一般目錄 + PM2 + PostgreSQL）
set -euo pipefail

APP_DIR="/var/www/henghui"
APP_NAME="henghui-web"

if [ ! -d "$APP_DIR" ]; then
  echo "⚠️ $APP_DIR 不存在"
  exit 1
fi

cd "$APP_DIR"

if [ ! -f ".env" ]; then
  echo "⚠️ .env 不存在，請先執行 deploy/setup-ezfix-server.sh"
  exit 1
fi

# 確保 Unix 換行
sed -i 's/\r$//' .env

echo "🚀 開始部署 ${APP_NAME}..."

echo "📚 安裝 npm 套件"
NODE_ENV=development npm ci

set -a
# shellcheck disable=SC1091
source .env
set +a

if [[ "${DATABASE_URL:-}" == postgresql:* ]]; then
  echo "🗄️ 使用 PostgreSQL，同步 schema"
  sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
  npx prisma db push
else
  echo "🗄️ 套用 SQLite migrations"
  npx prisma migrate deploy
fi

npx prisma generate

echo "📁 確保上傳目錄存在"
mkdir -p public/uploads/{services,hero,avatars,og,uploads}
chmod -R 755 public/uploads

if [ "$(node -e "const {PrismaClient}=require('@prisma/client');new PrismaClient().user.count().then(c=>{console.log(c);process.exit(0);}).catch(()=>{console.log(0);process.exit(0);});")" = "0" ]; then
  echo "🌱 初始化種子資料"
  npm run db:seed
fi

echo "🏗️ 建立 production build"
npm run build

echo "♻️ 重啟應用"
mkdir -p /var/log/henghui
pm2 reload deploy/ecosystem.config.cjs 2>/dev/null || pm2 start deploy/ecosystem.config.cjs
pm2 save
if ! systemctl is-enabled pm2-ubuntu >/dev/null 2>&1; then
  pm2 startup systemd -u "$USER" --hp "$HOME" | tail -1 | bash || true
  pm2 save
fi

echo "✅ 部署完成"
pm2 status
