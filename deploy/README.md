# Linode 部署指南

## 1. 建立 Linode VPS

1. 註冊 [Linode](https://www.linode.com/)
2. 建立 Linode：Nanode 1GB、Ubuntu 22.04 LTS、地區選 Singapore 或 Tokyo
3. 設定 root 密碼
4. 等 1-2 分鐘後 VPS 啟動

## 2. 首次連線設定

```powershell
ssh root@YOUR_LINODE_IP
```

把 `deploy/setup-linode.sh` 上傳並執行：

```powershell
# 在本機
scp deploy/setup-linode.sh root@YOUR_LINODE_IP:~/
ssh root@YOUR_LINODE_IP "bash setup-linode.sh"
```

## 3. 設定網域 DNS

到你的網域註冊商（Cloudflare / GoDaddy / 其他）：

| Type | Name | Value | TTL |
|---|---|---|---|
| A | @ | YOUR_LINODE_IP | 300 |
| A | www | YOUR_LINODE_IP | 300 |

## 4. 設定 Nginx + SSL

修改 `deploy/nginx.conf` 中的 `server_name` 為你的網域，然後上傳：

```powershell
scp deploy/nginx.conf root@YOUR_LINODE_IP:/etc/nginx/sites-available/henghui
ssh root@YOUR_LINODE_IP
ln -s /etc/nginx/sites-available/henghui /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

申請 SSL：

```bash
certbot --nginx -d ezfix.com.tw -d www.ezfix.com.tw
```

（照提示輸入 email，選 redirect HTTP → HTTPS）

## 5. 建立部署用帳號（建議）

不要用 root 部署，建立專用帳號：

```bash
adduser deploy
usermod -aG sudo deploy
mkdir -p /var/www/henghui
chown -R deploy:deploy /var/www/henghui
```

產生 SSH key：

```bash
sudo -u deploy ssh-keygen -t ed25519
cat /home/deploy/.ssh/id_ed25519.pub >> /home/deploy/.ssh/authorized_keys
```

把 private key 加到 GitHub Secrets：

```bash
cat /home/deploy/.ssh/id_ed25519
```

## 6. 第一次部署

把 `.env` 放到伺服器：

```bash
# 在 Linode 上
cd /var/www/henghui
nano .env
# 貼上：
#   DATABASE_URL="postgresql://henghui:YOUR_PASSWORD@localhost:5432/henghui?schema=public"
#   AUTH_SECRET="<隨機 32 bytes>"
#   NEXT_PUBLIC_SITE_URL="https://ezfix.com.tw"
```

然後從本機推送並觸發部署（或手動跑 `bash deploy.sh`）。

## 7. 自動備份（建議加上）

```bash
# 加 crontab
sudo crontab -e
# 加入這行：每天凌晨 3 點備份資料庫
0 3 * * * pg_dump -U henghui henghui | gzip > /var/backups/henghui-$(date +\%Y\%m\%d).sql.gz
# 保留 14 天
0 4 * * * find /var/backups/ -name "henghui-*.sql.gz" -mtime +14 -delete
```

---

## 疑難排解

| 問題 | 解法 |
|---|---|
| 502 Bad Gateway | `pm2 status` 看是否啟動，`pm2 logs` 看錯誤 |
| Prisma 連不到 | 確認 PostgreSQL 啟動：`systemctl status postgresql` |
| 上傳失敗 | 確認 `public/uploads/` 權限：`chmod -R 755` |
| 圖片 404 | 確認 `nginx.conf` 的 `location /uploads/` 設定 |
| 登入後馬上登出 | 確認 `AUTH_SECRET` 已設定且足夠長 |
