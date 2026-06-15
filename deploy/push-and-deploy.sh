#!/bin/bash
# 從本機推送程式碼到主機並部署
set -euo pipefail

SSH_KEY="${SSH_KEY:-$HOME/.ssh/ub2004}"
SSH_USER="${SSH_USER:-ubuntu}"
SSH_HOST="${SSH_HOST:-165.154.226.93}"
APP_DIR="/var/www/henghui"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

RSYNC_SSH="ssh -i ${SSH_KEY} -o StrictHostKeyChecking=accept-new"

echo "📤 同步程式碼到 ${SSH_USER}@${SSH_HOST}:${APP_DIR}"
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new "${SSH_USER}@${SSH_HOST}" "sudo mkdir -p ${APP_DIR} /var/log/henghui && sudo chown -R ${SSH_USER}:${SSH_USER} ${APP_DIR} /var/log/henghui"

rsync -avz --delete \
  --exclude node_modules \
  --exclude .next \
  --exclude .git \
  --exclude prisma/dev.db \
  --exclude prisma/dev.db-journal \
  --exclude .env \
  --exclude deploy_key \
  --exclude deploy_key_new \
  --exclude deploy_key_new.pub \
  --exclude deploy_key.pub \
  --exclude ssh-debug.log \
  --exclude server.info \
  -e "$RSYNC_SSH" \
  "${ROOT_DIR}/" "${SSH_USER}@${SSH_HOST}:${APP_DIR}/"

echo "🚀 遠端部署"
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new "${SSH_USER}@${SSH_HOST}" bash -s <<'REMOTE'
set -euo pipefail
APP_DIR="/var/www/henghui"
cd "$APP_DIR"
chmod +x deploy/setup-ezfix-server.sh deploy/deploy.sh
if [ ! -f .env ]; then
  bash deploy/setup-ezfix-server.sh
fi
bash deploy/deploy.sh
REMOTE

echo "🌐 https://ezfix.com.tw"
