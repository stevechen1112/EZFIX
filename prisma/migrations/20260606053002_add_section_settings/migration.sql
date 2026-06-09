-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "companyName" TEXT NOT NULL DEFAULT '恆惠修理紗窗',
    "phone" TEXT NOT NULL DEFAULT '0938989579',
    "lineUrl" TEXT NOT NULL DEFAULT 'https://line.me/ti/p/_8YeYUnzjS',
    "address" TEXT NOT NULL DEFAULT '台中市南區柳川東路一段50號',
    "businessHours" TEXT NOT NULL DEFAULT '08:00 AM - 17:00 PM',
    "facebookUrl" TEXT NOT NULL DEFAULT '',
    "instagramUrl" TEXT NOT NULL DEFAULT '',
    "seoTitle" TEXT NOT NULL DEFAULT '恆惠修理紗窗｜台中專業紗窗維修訂製',
    "seoDesc" TEXT NOT NULL DEFAULT '台中在地專業紗窗修理、折疊式紗窗訂製、鋁門窗維修、防霾網安裝服務。預約準時到場、價格透明。',
    "ogImage" TEXT NOT NULL DEFAULT '',
    "heroBadge" TEXT NOT NULL DEFAULT '台中專業紗窗修理',
    "heroSubtitle" TEXT NOT NULL DEFAULT '紗窗維修訂製｜折疊式紗窗｜鋁門窗維修｜防霾網安裝',
    "servicesTitle" TEXT NOT NULL DEFAULT '服務項目',
    "areaTitle" TEXT NOT NULL DEFAULT '服務區域',
    "areaMapImage" TEXT NOT NULL DEFAULT '/uploads/og/og-default.jpg',
    "areaCtaLabel" TEXT NOT NULL DEFAULT '來電諮詢',
    "reviewsTitle" TEXT NOT NULL DEFAULT '客戶回饋',
    "reviewsSubtitle" TEXT NOT NULL DEFAULT '看看客戶對我們最新真實回饋',
    "contactTitle" TEXT NOT NULL DEFAULT '聯絡我們',
    "contactPhoneLabel" TEXT NOT NULL DEFAULT '電話',
    "contactCtaLabel" TEXT NOT NULL DEFAULT '立即撥打',
    "contactDescription" TEXT NOT NULL DEFAULT '依照您的現況提供最好的建議及最妥善的處理方式，協助您解決問題。',
    "floatingPhoneLabel" TEXT NOT NULL DEFAULT '來電諮詢',
    "floatingLineLabel" TEXT NOT NULL DEFAULT 'LINE 諮詢',
    "mobilePhoneLabel" TEXT NOT NULL DEFAULT '立即聯絡',
    "mobileLineLabel" TEXT NOT NULL DEFAULT 'Line',
    "footerFbLabel" TEXT NOT NULL DEFAULT 'Facebook',
    "footerLineLabel" TEXT NOT NULL DEFAULT 'LINE',
    "footerCopyright" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SiteSettings" ("address", "businessHours", "companyName", "facebookUrl", "heroBadge", "heroSubtitle", "id", "instagramUrl", "lineUrl", "ogImage", "phone", "seoDesc", "seoTitle", "updatedAt") SELECT "address", "businessHours", "companyName", "facebookUrl", "heroBadge", "heroSubtitle", "id", "instagramUrl", "lineUrl", "ogImage", "phone", "seoDesc", "seoTitle", "updatedAt" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
