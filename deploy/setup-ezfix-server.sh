#!/bin/bash
# 首次設定 ezfix 主機（Ubuntu + 既有 Caddy + Docker PostgreSQL）
set -euo pipefail

APP_DIR="/var/www/henghui"
LOG_DIR="/var/log/henghui"
CADDY_SNIPPET="/etc/caddy/ezfix.caddy"
DB_NAME="henghui"
DB_USER="henghui"

echo "🔧 設定 ezfix 部署環境..."

sudo mkdir -p "$APP_DIR" "$LOG_DIR"
sudo chown -R "$USER:$USER" "$APP_DIR" "$LOG_DIR"

if ! command -v pm2 >/dev/null 2>&1; then
  echo "📦 安裝 PM2"
  sudo npm install -g pm2
fi

if ! sudo docker ps --format '{{.Names}}' | grep -q '^security-translate-db$'; then
  echo "❌ 找不到 Docker PostgreSQL（security-translate-db）"
  exit 1
fi

if [ ! -f "$APP_DIR/.env" ]; then
  DB_PASS="$(openssl rand -hex 24)"
  AUTH_SECRET="$(openssl rand -base64 32)"

  sudo docker exec security-translate-db psql -U security_translate -d security_translate -tc \
    "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1 \
    || sudo docker exec security-translate-db psql -U security_translate -d security_translate \
      -c "CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASS}';"

  if sudo docker exec security-translate-db psql -U security_translate -d security_translate -tc \
    "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1; then
    sudo docker exec security-translate-db psql -U security_translate -d security_translate \
      -c "ALTER ROLE ${DB_USER} WITH PASSWORD '${DB_PASS}';"
  fi

  if ! sudo docker exec security-translate-db psql -U security_translate -d security_translate -tc \
    "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
    sudo docker exec security-translate-db psql -U security_translate -d security_translate \
      -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"
  fi

  sudo docker exec security-translate-db psql -U security_translate -d security_translate \
    -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"

  cat > "$APP_DIR/.env" <<ENV
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@127.0.0.1:5432/${DB_NAME}?schema=public"
AUTH_SECRET="${AUTH_SECRET}"
NEXT_PUBLIC_SITE_URL="https://ezfix.com.tw"
NODE_ENV=production
ENV
  chmod 600 "$APP_DIR/.env"
  echo "✅ 已建立 $APP_DIR/.env"
else
  echo "ℹ️ 保留既有 $APP_DIR/.env"
fi

sudo cp "$APP_DIR/deploy/caddy-ezfix.caddy" "$CADDY_SNIPPET"

if ! grep -q 'import ezfix.caddy' /etc/caddy/Caddyfile; then
  echo 'import ezfix.caddy' | sudo tee -a /etc/caddy/Caddyfile >/dev/null
fi

sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy

echo "✅ 主機環境設定完成"
