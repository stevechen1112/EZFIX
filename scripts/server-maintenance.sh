#!/bin/bash
set -euo pipefail
APP_DIR="/var/www/henghui"
ENV_FILE="$APP_DIR/.env"
DB_FILE="$APP_DIR/prisma/dev.db"
SECRET_FILE="/root/henghui-contentflow-secret.txt"

NEW_SECRET=$(openssl rand -base64 32)
if grep -q '^CONTENTFLOW_SECRET=' "$ENV_FILE"; then
  sed -i "s|^CONTENTFLOW_SECRET=.*|CONTENTFLOW_SECRET=\"$NEW_SECRET\"|" "$ENV_FILE"
else
  echo "CONTENTFLOW_SECRET=\"$NEW_SECRET\"" >> "$ENV_FILE"
fi
printf '%s\n' "$NEW_SECRET" > "$SECRET_FILE"
chmod 600 "$SECRET_FILE"

sqlite3 "$DB_FILE" "DELETE FROM BlogPost WHERE slug='cf-health-check-delete-me';"

echo "Secret rotated -> $SECRET_FILE"
echo "Test draft deleted"
