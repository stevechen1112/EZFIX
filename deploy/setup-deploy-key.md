# 第一次部署步驟（密碼登入 → 安裝金鑰）

## 步驟 1：在你的電腦，用密碼登入伺服器
開啟 PowerShell 或終端機，執行：
```bash
ssh root@104.64.142.40
```
輸入你設定的 root 密碼。

## 步驟 2：登入成功後，在伺服器上貼上以下指令
這會把本機 `deploy_key.pub` 寫入伺服器的 `authorized_keys`：
```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDCHSTjQzy7yvpzfUsrK7jbAtYt7VmoXClMrR77LI6kxcvi99xCGMchdTWwI0xdLJQ41GzAWqYPM9E1ElolDNazvrIrSd5+sPtQrURq11n2vlhlTBlNfGqGPayqvQ0gJkVOMcNapHa2d2/edkYoQ0/FEOHAlYOJOFdI+oxvLDH6/YtCyiIHJM3iCoEcOBZVZSc0Gbv6rXcVlcAk2XWbwlRwyfRY/M5vc/GlmxQu1Zki9V1cQOFuhfhff9dtBbFCko8ZWqAjqa2e3fTRrE4JDeEaFbbHtV8jKBoD1LvkpQWEizc/IxGR9X+F+wVZ4/1MqJY7KJIrPAGb5B0iKb3caNygD3V/Ab8rFWBZkieewjjMZlY4fIWlwDyx2S3lTkmr69rUeairLsJhSlOcUPYtzq95UMKiUkKqrOIGa6670pFoeyABXEf/JKdG1Gdfp9PiO6mRotNiTAD3X2wsFgS7NtoOX/ta216P+pNgV2iY3kn/6Da7OlOsL7BvdhJo9gqw3kNWdYt02ok6BPxPGWu9g5Fqm2a3FYhyVit3GgFbqSCuQQA4vdz+Ib5T9I8Nz7k4P6uoJmABQfmFPdZOxJboO/6xAQkYNETC7I4rdCPPtW50PFSop2OlElcfALbSQEIcdWA23tPkWq7uzkIxZKAqhfo+awa+rHFhGrsnOPxF4b8owQ== henghui-deploy-key" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

## 步驟 3：測試金鑰登入
回到你電腦的 PowerShell，執行：
```bash
ssh -i "C:\Users\User\Desktop\恆惠紗窗門\web\deploy_key" root@104.64.142.40 whoami
```
如果回應 `root`，表示金鑰安裝成功，我這邊就能直接接續自動部署。
