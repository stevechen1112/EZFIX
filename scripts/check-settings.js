// 一次性查詢 SiteSettings 當前內容
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const s = await p.siteSettings.findUnique({ where: { id: 1 } });
console.log(JSON.stringify(s, null, 2));
await p.$disconnect();
