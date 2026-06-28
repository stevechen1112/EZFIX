#!/bin/bash
set -e
NEW_SECRET=$(openssl rand -base64 32)
sed -i "s|^CONTENTFLOW_SECRET=.*|CONTENTFLOW_SECRET=\"$NEW_SECRET\"|" /var/www/henghui/.env
printf '%s\n' "$NEW_SECRET" > /root/henghui-contentflow-secret.txt
chmod 600 /root/henghui-contentflow-secret.txt
sqlite3 /var/www/henghui/prisma/dev.db "DELETE FROM BlogPost WHERE slug='cf-health-check-delete-me';"
cd /var/www/henghui
tar xzf /tmp/henghui-deploy.tgz
bash deploy/deploy.sh
