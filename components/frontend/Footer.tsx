import Link from "next/link";
import type { SiteSettingsItem } from "@/types";

function Logo({ color = "#fff" }: { color?: string }) {
  return (
    <svg viewBox="0 0 64 64" className="w-8 h-8 flex-shrink-0">
      <rect x="6" y="10" width="40" height="48" fill="none" stroke={color} strokeWidth="4" />
      <rect x="14" y="18" width="24" height="8" fill={color} />
      <path d="M30 32 L42 44 L56 22" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Footer({
  settings,
  fbLabel,
  lineLabel,
}: {
  settings: SiteSettingsItem;
  fbLabel: string;
  lineLabel: string;
}) {
  return (
    <footer className="bg-[#1a1a1a] text-white/80">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Logo />
              <span className="font-bold text-white text-lg">{settings.companyName}</span>
            </div>
            <div className="text-sm space-y-1 text-white/70">
              <p>📞 {settings.phone}</p>
              <p>📍 {settings.address}</p>
              <p>🕐 {settings.businessHours}</p>
            </div>
          </div>

          <div className="flex md:justify-center gap-3">
            {settings.facebookUrl && (
              <Link
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center font-bold transition"
                aria-label={fbLabel}
              >
                f
              </Link>
            )}
            {settings.lineUrl && (
              <Link
                href={settings.lineUrl}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center font-bold transition"
                aria-label={lineLabel}
              >
                LINE
              </Link>
            )}
          </div>

          <div className="md:text-right text-sm text-white/50">
            {settings.footerCopyright || `© ${new Date().getFullYear()} by ${settings.companyName}`}
          </div>
        </div>
      </div>
    </footer>
  );
}
