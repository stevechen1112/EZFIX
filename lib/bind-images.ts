/**
 * 將 public/uploads/ 內既有檔案綁定到資料庫對應欄位。
 * 僅更新圖片路徑，不刪除或覆寫其他內容，可安全在生產環境執行。
 */
import { promises as fs } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { toMediaUrl } from "./media-url";

const SERVICE_IMAGE_MAP: Record<string, string> = {
  紗窗修理訂製: "services/service-1.jpeg",
  折疊式紗窗訂製: "services/service-2.jpg",
  鋁門窗維修: "services/service-3.jpeg",
  防霾網安裝: "services/service-4.jpg",
};

const REVIEW_IMAGE_MAP: Record<string, string> = {
  "Steve C***": "avatars/avatar-1.png",
  "Lily H*": "avatars/avatar-2.png",
  "ula C****": "avatars/avatar-3.png",
};

const HERO_IMAGES = ["hero/hero-1.jpg", "hero/hero-2.jpg", "hero/hero-3.jpeg"];

async function fileExists(filePath: string): Promise<boolean> {
  return fs.access(filePath).then(
    () => true,
    () => false
  );
}

export async function bindUploadImages(prisma: PrismaClient, cwd = process.cwd()) {
  const uploadsRoot = path.join(cwd, "public", "uploads");
  let bound = 0;

  const heroRecords = await prisma.heroSlide.findMany({ orderBy: { order: "asc" } });
  for (let i = 0; i < heroRecords.length; i++) {
    const relPath = HERO_IMAGES[i];
    if (!relPath) continue;
    const absPath = path.join(uploadsRoot, relPath);
    if (await fileExists(absPath)) {
      await prisma.heroSlide.update({
        where: { id: heroRecords[i].id },
        data: { image: toMediaUrl(relPath.replace(/\\/g, "/")) },
      });
      bound++;
    }
  }

  const serviceRecords = await prisma.service.findMany({ orderBy: { order: "asc" } });
  for (const s of serviceRecords) {
    const relPath = SERVICE_IMAGE_MAP[s.title];
    if (!relPath) continue;
    if (await fileExists(path.join(uploadsRoot, relPath))) {
      await prisma.service.update({
        where: { id: s.id },
        data: { image: toMediaUrl(relPath) },
      });
      bound++;
    }
  }

  const reviewRecords = await prisma.review.findMany({ orderBy: { order: "asc" } });
  let chenAvatarUsed = false;
  for (const r of reviewRecords) {
    let relPath: string | undefined = REVIEW_IMAGE_MAP[r.name];
    if (!relPath && r.name === "陳**" && !chenAvatarUsed) {
      relPath = "avatars/avatar-4.png";
      chenAvatarUsed = true;
    }
    if (!relPath) continue;
    if (await fileExists(path.join(uploadsRoot, relPath))) {
      await prisma.review.update({
        where: { id: r.id },
        data: { avatar: toMediaUrl(relPath) },
      });
      bound++;
    }
  }

  const ogPath = path.join(uploadsRoot, "og", "og-default.jpg");
  if (await fileExists(ogPath)) {
    const url = toMediaUrl("og/og-default.jpg");
    await prisma.siteSettings.update({
      where: { id: 1 },
      data: { areaMapImage: url, ogImage: url },
    });
    bound++;
  }

  return bound;
}
