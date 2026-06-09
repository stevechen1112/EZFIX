# 恆惠紗窗網站

台中在地紗窗修理服務的形象網站，含前台首頁與後台管理系統。

**🌐 正式網站**：https://ezfix.com.tw  
**📍 伺服器**：Linode VPS (104.64.142.40)  
**🔧 後台**：https://ezfix.com.tw/admin/login（帳號 `admin` / 密碼 `admin1234`）

---

## 技術棧

| 層級 | 技術 |
|------|------|
| 前端 / 後端 | Next.js 14（App Router） |
| 樣式 | Tailwind CSS |
| 資料庫 | SQLite（開發與生產皆使用） |
| ORM | Prisma 5 |
| 認證 | JWT + HttpOnly Cookie |
| 伺服器 | Ubuntu 24.04 LTS |
| 反向代理 | Nginx |
| 進程管理 | PM2（fork 模式） |
| SSL | Let's Encrypt（Certbot） |

---

## 快速開始（本機開發）

### 1. 安裝相依套件

```powershell
cd "c:\Users\User\Desktop\恆惠紗窗門\web"
npm install
```

### 2. 設定環境變數

複製 `.env.example` 為 `.env`：

```powershell
copy .env.example .env
```

編輯 `.env`，把 `AUTH_SECRET` 換成隨機字串：

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

把產出的字串貼到 `.env` 的 `AUTH_SECRET=...`

### 3. 初始化資料庫

```powershell
npm run setup
```

這會自動：
- 跑 Prisma migration
- 建立 7 張資料表
- 塞入預設資料（含管理員帳號）

### 4. 啟動開發伺服器

```powershell
npm run dev
```

開啟瀏覽器：

- 前台首頁：http://localhost:3000
- 後台登入：http://localhost:3000/admin/login
- 預設帳密：**admin / admin1234**

---

## 部署到 Linode（生產環境）

### A. 首次設定伺服器（一次性）

SSH 進入 Linode：

```bash
ssh root@104.64.142.40
```

安裝系統相依套件：

```bash
apt update && apt install -y curl wget git ufw software-properties-common nginx certbot python3-certbot-nginx
```

安裝 Node.js 20 LTS：

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt install -y nodejs
```

安裝 PM2：

```bash
npm install -g pm2
```

建立部署目錄：

```bash
mkdir -p /var/www/henghui /var/log/henghui
```

### B. 設定 SSH 金鑰（建議）

在本地生成 ed25519 金鑰：

```powershell
ssh-keygen -t ed25519 -f deploy_key_new -C "henghui-deploy"
```

將公鑰上傳到伺服器：

```bash
cat deploy_key_new.pub >> /root/.ssh/authorized_keys
```

> ⚠️ Ubuntu 24.04 預設不接受舊版 RSA 金鑰，請使用 ed25519。

### C. 上傳專案並部署

在本地打包專案（排除 node_modules、.next、.git）：

```powershell
cd "C:\Users\User\Desktop\恆惠紗窗門\web"
tar -czf ../henghui-web.tar.gz --exclude=node_modules --exclude=.next --exclude=.git .
```

上傳到伺服器：

```powershell
scp -i deploy_key_new henghui-web.tar.gz root@104.64.142.40:/tmp/
```

在伺服器解壓縮並安裝：

```bash
cd /var/www/henghui && tar -xzf /tmp/henghui-web.tar.gz
npm ci
```

### D. 設定環境變數

編輯 `/var/www/henghui/.env`：

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="qyXQ1fJlblCiH1obkARCnD+XKBWFjYxxCiKVehMBuB8="
NEXT_PUBLIC_SITE_URL="https://ezfix.com.tw"
NODE_ENV=production
```

> 🔐 建議將 `AUTH_SECRET` 換成 `openssl rand -base64 32` 產生的新字串。

> ⚠️ **重要提醒**：`.env` 檔案必須使用 Unix 換行符號（LF），不可使用 Windows 換行符號（CRLF）。
> 若從 Windows 上傳 `.env`，請在伺服器上執行 `sed -i 's/\r$//' /var/www/henghui/.env` 轉換。
> 否則 `NODE_ENV=production` 會被讀取為 `production\r`，導致 Cookie 的 `secure` 屬性為 `false`，
> 在 HTTPS 網站上瀏覽器拒絕傳送 Cookie，重新整理頁面時會被踢回登入頁。

### E. 初始化資料庫

```bash
cd /var/www/henghui
npx prisma migrate deploy
npx prisma generate
npm install -g tsx
npx tsx prisma/seed.ts
```

### F. 建置並啟動

```bash
cd /var/www/henghui
npm run build
pm2 start deploy/ecosystem.config.cjs
pm2 save
pm2 startup systemd
```

### G. 設定 Nginx

建立 `/etc/nginx/sites-available/henghui`：

```nginx
server {
    listen 80;
    server_name ezfix.com.tw www.ezfix.com.tw;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }

    client_max_body_size 50M;
}
```

啟用設定：

```bash
ln -sf /etc/nginx/sites-available/henghui /etc/nginx/sites-enabled/henghui
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

### H. 申請 SSL 憑證

```bash
certbot --nginx -d ezfix.com.tw -d www.ezfix.com.tw
```

憑證會自動續約，到期日為 2026-09-04。

### I. 設定防火牆

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

---

## 專案結構

```
web/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 根 layout
│   ├── page.tsx            # 前台首頁
│   ├── globals.css         # 全域樣式
│   ├── admin/              # 後台
│   │   ├── login/          # 登入頁
│   │   ├── logout/         # 登出 API
│   │   └── (protected)/    # 需登入的頁面
│   │       ├── dashboard/
│   │       ├── services/   # 服務項目 CRUD
│   │       ├── reviews/    # 客戶評論 CRUD
│   │       ├── hero/       # Hero 輪播
│   │       ├── areas/      # 服務區域
│   │       └── settings/   # 網站設定
│   └── api/
│       └── upload/         # 圖片上傳 API
├── components/
│   ├── frontend/           # 前台元件
│   └── admin/              # 後台元件
├── lib/
│   ├── prisma.ts           # Prisma client
│   ├── auth.ts             # JWT / 密碼 / session
│   └── utils.ts            # 工具函式
├── prisma/
│   ├── schema.prisma       # 資料模型
│   └── seed.ts             # 種子資料
├── public/
│   └── uploads/            # 上傳圖片（執行時建立）
├── deploy/                 # 部署用檔案
│   ├── deploy.sh
│   ├── setup-linode.sh
│   ├── nginx.conf
│   └── ecosystem.config.cjs
├── .env.example
├── package.json
└── README.md
```

---

## 後台功能

| 模組 | 路徑 | 功能 |
|---|---|---|
| 儀表板 | `/admin/dashboard` | 總覽數據 |
| 服務項目 | `/admin/services` | 新增/編輯/刪除 4 大服務 |
| 客戶回饋 | `/admin/reviews` | 新增/編輯/刪除評論 |
| Hero 輪播 | `/admin/hero` | 首頁主視覺輪播 |
| 服務區域 | `/admin/areas` | 新增/刪除區域名稱 |
| 網站設定 | `/admin/settings` | 公司資訊、SEO、Hero 預設 |

---

## 資料庫說明

本專案使用 **SQLite** 作為資料庫（開發與生產環境皆同），檔案位於 `prisma/dev.db`。

優點：
- 無需額外安裝 PostgreSQL 服務
- 備份簡單（只需複製 `dev.db` 檔案）
- 適合中小型網站

如需切換到 PostgreSQL：

`prisma/schema.prisma`：

```diff
 datasource db {
-  provider = "sqlite"
+  provider = "postgresql"
   url      = env("DATABASE_URL")
 }
```

`.env`：

```diff
- DATABASE_URL="file:./dev.db"
+ DATABASE_URL="postgresql://user:password@localhost:5432/henghui?schema=public"
```

然後重新跑 migration：

```bash
npx prisma migrate deploy
```

---

## 常用指令

```powershell
npm run dev          # 開發模式
npm run build        # 建立 production
npm start            # 啟動 production
npm run setup        # 一次性：prisma migrate + seed
npm run db:seed      # 重跑種子資料
npm run prisma:studio # 開啟資料庫 GUI
```

---

## 第二階段擴充（待規劃）

- [ ] 關於我們頁
- [ ] 服務詳情頁（每個服務可開自己的介紹）
- [ ] 作品案例 / 實績
- [ ] 最新消息 / 部落格
- [ ] 線上預約表單
- [ ] FAQ 常見問題
- [ ] 多語系（英 / 越 / 印）
- [ ] Google Maps 嵌入
- [ ] 自動備份腳本（每日 pg_dump）

---

---

## 部署狀態（2026-06-06）

| 項目 | 狀態 |
|------|------|
| 網站上線 | ✅ https://ezfix.com.tw |
| SSL 憑證 | ✅ Let's Encrypt（2026-09-04 到期，自動續約） |
| Nginx 反向代理 | ✅ 運作中 |
| PM2 進程管理 | ✅ fork 模式 |
| UFW 防火牆 | ✅ 22/80/443 開放 |
| 開機自動啟動 | ✅ PM2 + Nginx |
| 種子資料 | ✅ 已建立（admin / admin1234） |

---

## 注意事項

- **預設後台密碼** `admin1234` 首次登入後請立即到「帳號管理」變更
- **圖片上傳** 儲存於 `public/uploads/{folder}/`，建議定期備份
- **資料庫備份** 只需複製 `/var/www/henghui/prisma/dev.db`
- **AUTH_SECRET** 正式上線前建議換成 `openssl rand -base64 32` 產生的新字串
- **SSH 金鑰** Ubuntu 24.04 預設不接受舊版 RSA 金鑰，請使用 ed25519
- **Next.js 版本** 14.2.18 有安全漏洞，建議升級到修補版本
- **PM2 模式** 請使用 `fork` 模式，`cluster` 模式與 Next.js 不相容
