# Sync local public/uploads/ to Linode production
# Usage: .\scripts\sync-uploads.ps1

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$UploadsDir = Join-Path $ProjectRoot "public\uploads"

$RemoteHost = if ($env:LINODE_HOST) { $env:LINODE_HOST } else { "104.64.142.40" }
$RemoteUser = if ($env:LINODE_USER) { $env:LINODE_USER } else { "root" }
$SshKey = if ($env:LINODE_SSH_KEY) { $env:LINODE_SSH_KEY } else { Join-Path $ProjectRoot "deploy_key_new" }
$RemoteUploads = "/var/www/henghui/public/uploads"
$RemoteApp = "/var/www/henghui"

if (-not (Test-Path $UploadsDir)) {
  Write-Error "Local uploads folder not found: $UploadsDir"
}

$imageCount = (Get-ChildItem -Path $UploadsDir -Recurse -File | Where-Object { $_.Name -ne ".gitkeep" }).Count
if ($imageCount -eq 0) {
  Write-Error "No image files in local uploads. Run: node scripts/setup-images.js"
}

if (-not (Test-Path $SshKey)) {
  Write-Error "SSH key not found: $SshKey"
}

$target = "${RemoteUser}@${RemoteHost}"
Write-Host "Syncing $imageCount files to ${target}:${RemoteUploads}"

ssh -i $SshKey $target "mkdir -p $RemoteApp/lib $RemoteApp/scripts $RemoteApp/app/media"
scp -i $SshKey (Join-Path $ProjectRoot "lib\bind-images.ts") "${target}:${RemoteApp}/lib/"
scp -i $SshKey (Join-Path $ProjectRoot "lib\media-url.ts") "${target}:${RemoteApp}/lib/"
scp -i $SshKey (Join-Path $ProjectRoot "scripts\bind-upload-images.ts") "${target}:${RemoteApp}/scripts/"
scp -i $SshKey -r (Join-Path $ProjectRoot "app\media") "${target}:${RemoteApp}/app/"

ssh -i $SshKey $target "mkdir -p $RemoteUploads && chmod -R 755 $RemoteUploads"

$subdirs = Get-ChildItem -Path $UploadsDir -Directory
foreach ($dir in $subdirs) {
  $remoteSub = "${RemoteUploads}/$($dir.Name)"
  ssh -i $SshKey $target "mkdir -p $remoteSub"
  scp -i $SshKey -r "$($dir.FullName)\*" "${target}:${remoteSub}/"
  Write-Host "  OK $($dir.Name)/"
}

Write-Host "Binding image paths and rebuilding app..."
ssh -i $SshKey $target "cd $RemoteApp && npx tsx scripts/bind-upload-images.ts && npm run build && pm2 restart henghui-web"

Write-Host "Done. Verify:"
Write-Host "  Linode direct: curl -k -I https://104.64.142.40/media/hero/hero-1.jpg -H Host:ezfix.com.tw"
Write-Host "  Public domain: https://ezfix.com.tw/media/hero/hero-1.jpg"
Write-Host "  If public 404 but direct 200, set DNS A record to 104.64.142.40"
