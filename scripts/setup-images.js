// scripts/setup-images.js
// 一次性腳本：從原站下載圖片到 public/uploads/，並寫入資料庫
// 注意：此腳本假設您擁有原站圖片的合法使用權

import { PrismaClient } from "@prisma/client";
import { promises as fs, createWriteStream } from "fs";
import path from "path";
import https from "https";

const prisma = new PrismaClient();
const BASE = "https://ezfix.com.tw/wp-content/uploads/";
const UPLOADS = path.join(process.cwd(), "public", "uploads");

const images = [
  // Hero 背景（3 張）
  { url: "2023/12/modern-mid-century-living-kichen-room-interior-1-min.jpg", folder: "hero", name: "hero-1.jpg", slideIndex: 0 },
  { url: "2023/12/%E6%A1%88%E4%BE%8B%E7%85%A7%E7%89%87.jpg", folder: "hero", name: "hero-2.jpg", slideIndex: 1 },
  { url: "2025/06/fix.jpeg", folder: "hero", name: "hero-3.jpeg", slideIndex: 2 },

  // 服務配圖（4 張）
  { url: "2024/10/%E7%B4%97%E7%AA%97%E4%BF%AE%E7%90%86%E8%A8%82%E8%A3%BD.jpeg", folder: "services", name: "service-1.jpeg", serviceIndex: 0 },
  { url: "2025/06/%E6%8A%98%E7%96%8A%E7%B4%97%E7%AA%97.jpg", folder: "services", name: "service-2.jpg", serviceIndex: 1 },
  { url: "2024/10/%E9%8B%81%E9%96%80%E7%AA%97%E7%B6%AD%E4%BF%AE.jpeg", folder: "services", name: "service-3.jpeg", serviceIndex: 2 },
  { url: "2024/10/143.jpg", folder: "services", name: "service-4.jpg", serviceIndex: 3 },

  // 評論頭像（4 張）
  { url: "2024/03/a-01_20240321_134115682.png", folder: "avatars", name: "avatar-1.png", reviewIndex: 0 },
  { url: "2024/03/8.png", folder: "avatars", name: "avatar-2.png", reviewIndex: 1 },
  { url: "2024/03/3-2-01.png", folder: "avatars", name: "avatar-3.png", reviewIndex: 2 },
  { url: "2024/02/2-2-01.png", folder: "avatars", name: "avatar-4.png", reviewIndex: 3 },

  // OG 分享圖
  { url: "2025/06/%E6%A9%AB%E6%9C%83%E4%BF%AE%E7%90%86%E7%B4%97%E7%AA%97-%E6%9C%8D%E5%8B%99%E5%8D%80%E5%9F%9F.jpg", folder: "og", name: "og-default.jpg" },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    const get = (u) =>
      https
        .get(u, (res) => {
          if (res.statusCode === 301 || res.statusCode === 302) {
            file.close();
            return get(res.headers.location).then(resolve, reject);
          }
          if (res.statusCode !== 200) {
            file.close();
            return reject(new Error(`HTTP ${res.statusCode}`));
          }
          res.pipe(file);
          file.on("finish", () => file.close(() => resolve()));
        })
        .on("error", (err) => {
          file.close();
          reject(err);
        });
    get(url);
  });
}

async function main() {
  console.log("📥 開始下載圖片到 public/uploads/ ...\n");
  let ok = 0, fail = 0;
  for (const img of images) {
    const dir = path.join(UPLOADS, img.folder);
    await fs.mkdir(dir, { recursive: true });
    const dest = path.join(dir, img.name);
    try {
      await download(BASE + img.url, dest);
      const stat = await fs.stat(dest);
      const kb = (stat.size / 1024).toFixed(0);
      console.log(`  ✅ ${img.folder}/${img.name} (${kb} KB)`);
      ok++;
    } catch (e) {
      console.log(`  ❌ ${img.url} — ${e.message}`);
      fail++;
    }
  }
  console.log(`\n下載完成：${ok} 成功 / ${fail} 失敗\n`);

  console.log("🗄️  更新資料庫...\n");

  // Hero 投影片：更新現有第一張 + 新增其他張
  const heroImgs = images
    .filter((i) => i.slideIndex !== undefined)
    .sort((a, b) => a.slideIndex - b.slideIndex);

  const existingSlides = await prisma.heroSlide.findMany({ orderBy: { id: "asc" } });

  // 確保有足夠的 hero slide 紀錄
  for (let i = 0; i < heroImgs.length; i++) {
    const url = `/uploads/${heroImgs[i].folder}/${heroImgs[i].name}`;
    const titles = ["台中專業紗窗修理", "專業紗窗・鋁門窗訂製", "立即預約・價格透明"];
    const subs = ["預約準時到場・價格透明・品質保證", "各種窗型丈量訂製・到府施工", "在地深耕・用心服務每一戶"];

    if (existingSlides[i]) {
      await prisma.heroSlide.update({
        where: { id: existingSlides[i].id },
        data: { image: url, title: titles[i] || existingSlides[i].title, subtitle: subs[i] || existingSlides[i].subtitle, order: i + 1 },
      });
    } else {
      await prisma.heroSlide.create({
        data: {
          image: url,
          title: titles[i] || "",
          subtitle: subs[i] || "",
          ctaLabel: "立即來電諮詢",
          ctaHref: "tel:0938989579",
          order: i + 1,
        },
      });
    }
  }
  console.log(`  ✅ Hero 投影片 ${heroImgs.length} 張`);

  // 服務配圖
  const serviceImgs = images
    .filter((i) => i.serviceIndex !== undefined)
    .sort((a, b) => a.serviceIndex - b.serviceIndex);
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  for (let i = 0; i < serviceImgs.length; i++) {
    const url = `/uploads/${serviceImgs[i].folder}/${serviceImgs[i].name}`;
    if (services[i]) {
      await prisma.service.update({ where: { id: services[i].id }, data: { image: url } });
    }
  }
  console.log(`  ✅ 服務配圖 ${Math.min(serviceImgs.length, services.length)} 張`);

  // 評論頭像
  const avatarImgs = images
    .filter((i) => i.reviewIndex !== undefined)
    .sort((a, b) => a.reviewIndex - b.reviewIndex);
  const reviews = await prisma.review.findMany({ orderBy: { order: "asc" } });
  for (let i = 0; i < avatarImgs.length; i++) {
    const url = `/uploads/${avatarImgs[i].folder}/${avatarImgs[i].name}`;
    if (reviews[i]) {
      await prisma.review.update({ where: { id: reviews[i].id }, data: { avatar: url } });
    }
  }
  console.log(`  ✅ 評論頭像 ${Math.min(avatarImgs.length, reviews.length)} 張`);

  // OG 圖
  const og = images.find((i) => i.name === "og-default.jpg");
  if (og) {
    await prisma.siteSettings.update({
      where: { id: 1 },
      data: { ogImage: `/uploads/${og.folder}/${og.name}` },
    });
    console.log(`  ✅ OG 分享圖`);
  }

  console.log("\n🎉 全部完成！重新整理前台即可看到圖片。");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
