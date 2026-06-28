import { PrismaClient } from "@prisma/client";
import { bindUploadImages } from "../lib/bind-images";

const prisma = new PrismaClient();

async function main() {
  console.log("🔗 開始綁定 public/uploads/ 圖片到資料庫...");
  const bound = await bindUploadImages(prisma);
  console.log(`✅ 已綁定 ${bound} 個圖片路徑`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
