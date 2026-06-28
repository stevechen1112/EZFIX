#!/bin/bash
set -e
SECRET=$(cat /root/henghui-contentflow-secret.txt)
BASE=http://127.0.0.1:3000

echo "=== PM2 ==="
pm2 list

echo "=== HEALTH ==="
curl -sf "$BASE/api/health"
echo

echo "=== CONTENTFLOW LEGACY ==="
curl -sf -X POST "$BASE/api/contentflow/publish" \
  -H "Authorization: Bearer $SECRET" \
  -H "Content-Type: application/json" \
  -d '{"title":"verify-delete-me","slug":"cf-verify-delete-me","content":"verify body","status":"draft"}'
echo

echo "=== API V1 POST ==="
curl -sf -X POST "$BASE/api/v1/posts" \
  -H "Authorization: Bearer $SECRET" \
  -H "Content-Type: application/json" \
  -d '{"title":"verify-v1-delete-me","slug":"cf-v1-verify-delete-me","content":"verify v1","status":"draft"}'
echo

echo "=== API V1 PUT ==="
curl -sf -X PUT "$BASE/api/v1/posts/cf-v1-verify-delete-me" \
  -H "Authorization: Bearer $SECRET" \
  -H "Content-Type: application/json" \
  -d '{"title":"verify-v1-updated"}'
echo

echo "=== UPDATE LEGACY ==="
curl -sf -X PUT "$BASE/api/contentflow/update/cf-verify-delete-me" \
  -H "Authorization: Bearer $SECRET" \
  -H "Content-Type: application/json" \
  -d '{"title":"verify-updated"}'
echo

echo "=== CLEANUP ==="
python3 -c "import sqlite3;c=sqlite3.connect('/var/www/henghui/prisma/dev.db');c.execute('DELETE FROM BlogPost WHERE slug IN (?,?)',('cf-verify-delete-me','cf-v1-verify-delete-me'));c.commit();print('deleted',c.total_changes)"

echo "=== OLD SECRET REJECT ==="
code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/contentflow/publish" \
  -H "Authorization: Bearer cf-henghui-2026-change-me" \
  -H "Content-Type: application/json" \
  -d '{"title":"x","slug":"x","content":"x"}')
echo "old-secret-http:$code"

echo "=== MEDIA ==="
for p in /media/hero/hero-1.jpg /media/services/service-1.jpeg; do
  code=$(curl -s -o /dev/null -w '%{http_code}' -H "Host: ezfix.com.tw" "http://127.0.0.1:3000$p")
  echo "$p:$code"
done

echo "=== ENV ==="
grep -E 'GA_MEASUREMENT|CONTENTFLOW|SITE_URL' /var/www/henghui/.env | sed 's/CONTENTFLOW_SECRET=.*/CONTENTFLOW_SECRET=***/'
