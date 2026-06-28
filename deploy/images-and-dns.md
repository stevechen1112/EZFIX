# 圖片與 DNS 說明

## 圖片儲存位置

- 實體檔案：`public/uploads/`（不進 Git）
- 前台 URL：`/media/...`（由 Next.js 提供，可穿透 Caddy 反向代理）
- 舊路徑 `/uploads/...` 若被 Caddy 攔截會 404，程式會自動轉成 `/media/...`

## 同步圖片到 Linode

```powershell
cd web
npm run images:sync
```

或手動：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/sync-uploads.ps1
```

## DNS 重要提醒

| 項目 | 值 |
|------|-----|
| 應用伺服器（Linode） | `104.64.142.40` |
| 目前部分流量經過 | `165.154.226.93`（Caddy） |

若 `ezfix.com.tw` 的 A 記錄指向 `165.154.226.93`，訪客不會連到已修復的 Linode。

**請將網域 A 記錄改為 `104.64.142.40`**，或在那台 Caddy 伺服器上設定轉發到 Linode。

驗證：

```powershell
nslookup ezfix.com.tw
curl.exe -k -I https://104.64.142.40/media/hero/hero-1.jpg -H "Host: ezfix.com.tw"
curl.exe -I https://ezfix.com.tw/media/hero/hero-1.jpg
```

兩者都應回 `HTTP 200`。

## 部署時保護圖片

`deploy/deploy.sh` 會在每次部署前：

1. 備份 `public/uploads/` 到 `/var/backups/henghui/`
2. 備份 `prisma/dev.db`
3. 部署後還原 uploads 目錄

## 僅更新資料庫圖片路徑（不動其他內容）

```bash
npm run images:bind
```
