import { getSiteSettings } from "@/lib/site-settings";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingButtons } from "./FloatingButtons";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <>
      <Header logoText={settings.companyName} phone={settings.phone} />
      {children}
      <Footer
        settings={settings}
        fbLabel={settings.footerFbLabel}
        lineLabel={settings.footerLineLabel}
      />
      <FloatingButtons
        phone={settings.phone}
        lineUrl={settings.lineUrl}
        phoneLabel={settings.floatingPhoneLabel}
        lineLabel={settings.floatingLineLabel}
        mobilePhoneLabel={settings.mobilePhoneLabel}
        mobileLineLabel={settings.mobileLineLabel}
      />
    </>
  );
}
