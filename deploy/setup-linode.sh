#!/bin/bash
# ============================================
# Linode 首次設定腳本（Ubuntu 22.04）
# 用 root 帳號執行：bash setup-linode.sh
# ============================================

set -e

echo "🔧 開始設定 Linode 伺服器..."

# 1. 更新系統
apt update && apt upgrade -y

# 2. 安裝基本工具
apt install -y curl wget git ufw software-properties-common

# 3. 安裝 Node.js 20 LTS
echo "📦 安裝 Node.js 20"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 4. 安裝 PM2
echo "🔄 安裝 PM2"
npm install -g pm2

# 5. 安裝 Nginx
echo "🌐 安裝 Nginx"
apt install -y nginx
systemctl enable nginx

# 6. 專案使用 SQLite，跳過 PostgreSQL

echo "🗄️ 專案使用 SQLite，跳過 PostgreSQL 安裝"

# 7. 設定防火牆
echo "🛡️ 設定 UFW"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# 8. 建立部署目錄
echo "📁 建立部署目錄"
mkdir -p /var/www/henghui
mkdir -p /var/log/henghui
chown -R $USER:$USER /var/www/henghui /var/log/henghui

# 9. 安裝 Certbot（Let's Encrypt）
echo "🔒 安裝 Certbot"
apt install -y certbot python3-certbot-nginx

echo ""
echo "✅ 基礎設定完成！"
echo ""
echo "📋 接下來請手動完成："
echo "  1. 編輯 /etc/nginx/sites-available/henghui（已建立 nginx.conf 範本）"
echo "  2. 啟用站台：ln -s /etc/nginx/sites-available/henghui /etc/nginx/sites-enabled/"
echo "  3. 申請 SSL：sudo certbot --nginx -d ezfix.com.tw -d www.ezfix.com.tw"
echo "  4. 建立 .env：cd /var/www/henghui && nano .env"
echo "  5. 第一次部署：bash deploy.sh"
echo ""
