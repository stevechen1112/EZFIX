// 種子資料 — 第一次跑 prisma migrate 後執行 npm run db:seed
// 此檔案由網站業主（您）提供內容，已確認具有完整使用權
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 開始建立種子資料...");

  // 1) 預設管理員
  const passwordHash = await bcrypt.hash("admin1234", 10);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: passwordHash,
      name: "管理員",
      role: "admin",
    },
  });
  console.log("✅ 管理員帳號：admin / admin1234");

  // 2) 網站設定（含所有區塊標題、按鈕文字、預設值）
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      // 不在 update 留空，避免重跑 seed 把業主改過的東西蓋掉
    },
    create: {
      id: 1,
      companyName: "恆惠修理紗窗",
      phone: "0938989579",
      lineUrl: "https://line.me/ti/p/_8YeYUnzjS",
      address: "台中市南區柳川東路一段50號",
      businessHours: "08:00 AM - 17:00 PM",
      facebookUrl: "https://www.facebook.com/myhomefixer",
      heroBadge: "台中專業紗窗修理",
      heroSubtitle: "紗窗維修訂製｜折疊式紗窗｜鋁門窗維修｜防霾網安裝",
      servicesTitle: "服務項目",
      areaTitle: "服務區域",
      areaMapImage: "/uploads/og/og-default.jpg",
      areaCtaLabel: "來電諮詢",
      reviewsTitle: "客戶回饋",
      reviewsSubtitle: "看看客戶對我們最新真實回饋",
      contactTitle: "聯絡我們",
      contactPhoneLabel: "電話",
      contactCtaLabel: "立即撥打",
      contactDescription: "依照您的現況提供最好的建議及最妥善的處理方式，協助您解決問題。",
      floatingPhoneLabel: "來電諮詢",
      floatingLineLabel: "LINE 諮詢",
      mobilePhoneLabel: "立即聯絡",
      mobileLineLabel: "Line",
      footerFbLabel: "Facebook",
      footerLineLabel: "LINE",
      seoTitle: "恆惠修理紗窗｜台中專業紗窗維修訂製",
      seoDesc:
        "台中在地專業紗窗修理、折疊式紗窗訂製、鋁門窗維修、防霾網安裝服務。預約準時到場、價格透明。",
    },
  });
  console.log("✅ 網站設定（含所有區塊預設值）");

  // 3) Hero 輪播（預設 3 張，與原站一致）
  await prisma.heroSlide.deleteMany();
  const heroSlides = [
    {
      image: "",
      title: "台中專業紗窗修理",
      subtitle: "紗窗維修訂製｜折疊式紗窗｜鋁門窗維修｜防霾網安裝",
      ctaLabel: "立即來電諮詢",
      ctaHref: "tel:0938989579",
      order: 1,
    },
    {
      image: "",
      title: "專業紗窗・鋁門窗訂製",
      subtitle: "各種窗型丈量訂製・到府施工",
      ctaLabel: "立即來電諮詢",
      ctaHref: "tel:0938989579",
      order: 2,
    },
    {
      image: "",
      title: "立即預約・價格透明",
      subtitle: "在地深耕・用心服務每一戶",
      ctaLabel: "立即來電諮詢",
      ctaHref: "tel:0938989579",
      order: 3,
    },
  ];
  for (const s of heroSlides) {
    await prisma.heroSlide.create({ data: s });
  }
  console.log(`✅ Hero 輪播預設 ${heroSlides.length} 張`);

  // 4) 服務項目
  const services = [
    {
      title: "紗窗修理訂製",
      description:
        "使用多年容易出現破損、變形、滑動卡卡等問題，舊型紗窗無法有效防蚊蟲、透氣性差，每戶窗型不同，找對適合的窗型才能真正密合、好用。",
      features: [
        "舊網更換、窗輪更新、膠條更換",
        "鋁框、塑鋼、不鏽鋼、隱藏式",
        "預約準時到場，確保維修品質",
        "傳統紗窗、氣密窗皆可維修",
      ],
      icon: "wrench",
      order: 1,
    },
    {
      title: "折疊式紗窗訂製",
      description:
        "傳統紗門開合預留空間大，影響家庭空間利用，折疊式可側收、對開，適合陽台門、落地窗，配合窗框量身打造，保持通風與隱私。",
      features: [
        "折疊紗窗現場丈量、設計與訂製",
        "多種顏色可供選擇",
        "測量安裝快速，測量完兩天內可施工",
        "尺寸依框型大小客製，貼緊框邊不留縫",
      ],
      icon: "frame",
      order: 2,
    },
    {
      title: "鋁門窗維修",
      description:
        "滑軌卡住、滑輪老化，開關不順，門窗縫隙大、進風進水影響生活品質，老舊五金容易故障，影響安全性。",
      features: [
        "更換滑輪、把手等各式五金",
        "門窗變形修復，確保密合度",
        "鋁門窗玻璃破裂更換",
        "傳統窗型、氣密窗型皆可維修",
      ],
      icon: "door-open",
      order: 3,
    },
    {
      title: "防霾網安裝",
      description:
        "空汙嚴重、開窗就進灰塵，影響呼吸健康，一般紗網無法有效阻隔 PM2.5 微粒，防霾網可兼顧通風與淨化，是都會住宅新選擇。",
      features: [
        "高知名品牌防霾網安裝，現場量測價格合理",
        "安裝於原窗框上，無需另外訂製框架",
        "檢測合格產品，安全可靠沒有疑慮",
        "適用於各平面窗窗型",
      ],
      icon: "shield-check",
      order: 4,
    },
  ];
  await prisma.service.deleteMany();
  for (const s of services) {
    await prisma.service.create({ data: { ...s, features: JSON.stringify(s.features) } });
  }
  console.log(`✅ 服務項目 ${services.length} 筆`);

  // 5) 客戶評論
  const reviews = [
    {
      name: "Steve C***",
      content:
        "我們家陽台的紗窗已經卡超久，每次推開都像在健身，有時候還會卡住不能動。原本真的以為要整個重做才行，結果找了這家來處理，師傅現場看過後說其實只是輪子老化＋滑軌灰塵堆太多。當場就幫我清理、換輪，一個小時內處理得服服貼貼，現在用起來像新的一樣滑順，真的省下不少錢也很安心。超感謝這麼專業、又不亂報價的團隊。",
      rating: 5,
      order: 1,
    },
    {
      name: "Lily H*",
      content:
        "以前覺得紗窗破個小洞沒什麼，直到最近天氣熱到受不了，想開窗省電，又怕蚊子飛進來咬得睡不著。鄰居介紹這家專門修紗窗的，原本想說只是修個網，沒想到整個施工超細心，連窗邊的細縫都處理到位，還幫我檢查了其他幾扇快壞的窗戶，這師傅真的不錯。",
      rating: 5,
      order: 2,
    },
    {
      name: "ula C****",
      content:
        "我媽超在意家裡的窗戶，只要有縫就會一直說有蚊子會跑進來。這次請這家來換紗窗，師傅整個下午很有耐心慢慢調整，窗框都一一對準調平，這家不錯可以推薦。",
      rating: 5,
      order: 3,
    },
    {
      name: "陳**",
      content:
        "本來想自己跑建材行 DIY 換紗網，後來想想放棄，找到這位師傅，準時、動作俐落、還會提醒我們注意家裡哪幾扇窗戶也快老化了。整個流程不到一個半小時，窗戶全部換好，現場也整理得乾乾淨淨，完全不留髒亂，幸好沒有衝動自己亂處理，大推這家。",
      rating: 5,
      order: 4,
    },
    {
      name: "陳**",
      content:
        "我家門口那道折疊式紗門，關不起來已經忍好幾個月了。之前有問其他維修的，都說只能整組換新，價格聽了真的很猶豫。這次找恆惠來看看，師傅居然說其實不用整個換，只要把裡面的五金、調整紗門張力就可以！修完後關門密合度超好，真的是很會。",
      rating: 5,
      order: 5,
    },
  ];
  await prisma.review.deleteMany();
  for (const r of reviews) {
    await prisma.review.create({ data: r });
  }
  console.log(`✅ 客戶評論 ${reviews.length} 筆`);

  // 6) 服務區域
  const areas = [
    "東區", "西區", "南區", "北區", "中區",
    "南屯區", "西屯區", "北屯區",
    "太平區", "大里區", "烏日區",
    "潭子區", "神岡區", "豐原區", "沙鹿區", "大雅區",
  ];
  await prisma.serviceArea.deleteMany();
  for (let i = 0; i < areas.length; i++) {
    await prisma.serviceArea.create({ data: { name: areas[i], order: i + 1 } });
  }
  console.log(`✅ 服務區域 ${areas.length} 筆`);

  // 7) 部落格範例文章（業主可編輯或刪除）
  await prisma.blogPost.deleteMany();
  const samplePosts = [
    {
      title: "紗窗日常保養 5 個小技巧",
      slug: "screen-window-care-tips",
      excerpt: "做好日常清潔與保養，能讓紗窗用得更久、推拉更順暢。整理 5 個不花錢的實用方法。",
      content: `很多人以為紗窗壞了只能整片換新，其實只要平日多用點心，就能大幅延長使用壽命。以下是 5 個最基本、但多數人容易忽略的保養方式。

一、定期用吸塵器清理溝槽灰塵
滑軌與窗框溝槽是最容易堆積灰塵的地方，累積後會讓紗窗推拉變卡。每 1-2 個月用吸塵器或乾刷順著溝槽清一次，順暢度會明顯改善。

二、避免用水柱直沖紗網
很多人清洗紗窗時會用高壓水槍直沖，雖然方便但容易讓紗網變形、脫落。建議用軟毛刷搭配中性清潔劑輕刷，再用清水沖洗即可。

三、定期檢查窗輪與膠條
紗窗推不順、卡住，多半是窗輪磨損或膠條硬化。發現問題可請師傅評估更換，不需要整片重做。

四、避免重壓紗網
紗網是塑膠或玻璃纖維材質，長期重壓會變形。請勿在紗窗上放置物品或讓小朋友攀爬。

五、颱風或大雨前先檢查固定
鋁窗或紗窗在風大時如果沒有確實固定，長期下來容易變形影響密合度。建議在颱風季節來臨前請師傅做一次全面檢查。

做好以上幾點，一組品質好的紗窗用上 8-10 年都不是問題。如有維修需求，歡迎聯繫我們評估。`,
      authorName: "恆惠修理紗窗",
      category: "保養知識",
      tags: "紗窗, 保養, 維修",
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: "如何判斷該維修還是該換新？",
      slug: "repair-or-replace",
      excerpt: "紗窗或鋁門窗出了問題，到底該修還是換？從 4 個方向幫您判斷。",
      content: `很多客戶第一次聯繫我們時，最常問的就是「這個還能修嗎？還是要整個換新的？」其實多數情況下，局部維修就能解決問題，費用也只有整組更換的 1/3 到 1/2。

以下 4 個方向可以幫助您快速判斷：

一、看損壞的位置與範圍
如果只是窗輪、膠條、滑軌等五金零件故障，幾乎都可以單獨更換。整片紗網破一個洞，補一片網也比整組換新便宜很多。

二、看鋁框是否變形
鋁框如果還維持方正、沒有明顯凹陷，維修就有意義。如果窗框已經嚴重變形、密合度喪失，通常就建議整組更新了。

三、看使用年限
正常使用下，鋁窗主體可以用 15-20 年以上。紗網的壽命通常 5-10 年。如果鋁框還很新，只是紗網或五金老舊，維修絕對比換新划算。

四、看玻璃狀態
玻璃有破裂、霧化、結露（兩層玻璃之間起霧）等問題，多數可以單片更換，不需要整個換窗。

下次家裡的紗窗或鋁門窗出問題時，可以先拍照傳 LINE 給師傅看，師傅會依現場狀況給您最中肯的建議。`,
      authorName: "恆惠修理紗窗",
      category: "維修建議",
      tags: "維修, 紗窗, 鋁門窗",
      isPublished: true,
      publishedAt: new Date(Date.now() - 86400000 * 3), // 3 天前
    },
  ];
  for (const p of samplePosts) {
    await prisma.blogPost.create({ data: p });
  }
  console.log(`✅ 部落格範例文章 ${samplePosts.length} 篇`);

  // 7) 綁定圖片到對應記錄（解決 seed 刪除後圖片路徑消失的問題）
  const fs = await import("fs/promises");
  const path = await import("path");
  const uploadsRoot = path.join(process.cwd(), "public", "uploads");

  // 定義「服務 → 圖片檔名」對應
  const serviceImageMap: Record<string, string> = {
    "紗窗修理訂製": "services/service-1.jpeg",
    "折疊式紗窗訂製": "services/service-2.jpg",
    "鋁門窗維修": "services/service-3.jpeg",
    "防霾網安裝": "services/service-4.jpg",
  };
  // 評論 → 頭像
  const reviewImageMap: Record<string, string> = {
    "Steve C***": "avatars/avatar-1.png",
    "Lily H*": "avatars/avatar-2.png",
    "ula C****": "avatars/avatar-3.png",
  };
  // 評論（陳** 有兩則，第二則用 avatar-4）
  const chenAvatarAssigned = new Set<string>();

  let imgBound = 0;

  // Hero：用既有的 3 張圖（依資料表順序綁定）
  const heroImgs = ["hero/hero-1.jpg", "hero/hero-2.jpg", "hero/hero-3.jpeg"];
  const heroRecords = await prisma.heroSlide.findMany({ orderBy: { order: "asc" } });
  for (let i = 0; i < heroRecords.length; i++) {
    const relPath = heroImgs[i];
    if (!relPath) continue;
    const absPath = path.join(uploadsRoot, relPath);
    if (await fs.access(absPath).then(() => true).catch(() => false)) {
      await prisma.heroSlide.update({
        where: { id: heroRecords[i].id },
        data: { image: `/uploads/${relPath.replace(/\\/g, "/")}` },
      });
      imgBound++;
    }
  }

  // 服務
  const serviceRecords = await prisma.service.findMany({ orderBy: { order: "asc" } });
  for (const s of serviceRecords) {
    const relPath = serviceImageMap[s.title];
    if (!relPath) continue;
    const absPath = path.join(uploadsRoot, relPath);
    if (await fs.access(absPath).then(() => true).catch(() => false)) {
      await prisma.service.update({
        where: { id: s.id },
        data: { image: `/uploads/${relPath}` },
      });
      imgBound++;
    }
  }

  // 評論
  const reviewRecords = await prisma.review.findMany({ orderBy: { order: "asc" } });
  for (const r of reviewRecords) {
    let relPath = reviewImageMap[r.name];
    if (!relPath && r.name === "陳**") {
      relPath = "avatars/avatar-4.png";
    }
    if (!relPath) continue;
    const absPath = path.join(uploadsRoot, relPath);
    if (await fs.access(absPath).then(() => true).catch(() => false)) {
      await prisma.review.update({
        where: { id: r.id },
        data: { avatar: `/uploads/${relPath}` },
      });
      imgBound++;
    }
  }

  // SiteSettings 綁定地圖與 OG 圖
  const mapPath = path.join(uploadsRoot, "og", "og-default.jpg");
  if (await fs.access(mapPath).then(() => true).catch(() => false)) {
    await prisma.siteSettings.update({
      where: { id: 1 },
      data: { areaMapImage: "/uploads/og/og-default.jpg" },
    });
    imgBound++;
  }

  console.log(`✅ 圖片綁定 ${imgBound} 個`);

  console.log("\n🎉 種子資料建立完成！");
  console.log("👉 啟動開發伺服器：npm run dev");
  console.log("👉 後台登入：admin / admin1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
