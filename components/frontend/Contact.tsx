import Link from "next/link";
import type { SiteSettingsItem } from "@/types";

export function Contact({
  settings,
  title,
  phoneLabel,
  ctaLabel,
}: {
  settings: SiteSettingsItem;
  title: string;
  phoneLabel: string;
  ctaLabel: string;
}) {
  return (
    <section id="contact" className="bg-[#1a1a1a] py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="title-blue title-underline-left text-3xl md:text-4xl font-bold text-left">
              {title}
            </h2>
            <p className="mt-6 text-gray-700 leading-loose">
              {settings.companyName} — {settings.contactDescription}
            </p>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-gray-500 text-sm">{phoneLabel}</p>
            <p className="text-3xl md:text-4xl font-black text-gray-900 tracking-wide">
              {settings.phone}
            </p>
            <div className="mt-6">
              <Link href={`tel:${settings.phone}`} className="btn-call">
                📞 {ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
