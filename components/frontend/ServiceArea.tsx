import Link from "next/link";
import type { ServiceAreaItem } from "@/types";

export function ServiceArea({
  areas,
  phone,
  mapImage,
  title,
  ctaLabel,
}: {
  areas: ServiceAreaItem[];
  phone: string;
  mapImage?: string;
  title: string;
  ctaLabel: string;
}) {
  const half = Math.ceil(areas.length / 2);
  const row1 = areas.slice(0, half).map((a) => a.name).join("、");
  const row2 = areas.slice(half).map((a) => a.name).join("、");

  return (
    <section id="areas" className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <h2 className="title-blue title-underline text-3xl md:text-4xl font-bold">{title}</h2>

        <h3 className="mt-10 text-xl md:text-2xl font-bold text-gray-900 leading-loose">
          {row1}
          <br />
          {row2}
        </h3>

        <div className="mt-10">
          {mapImage ? (
            <div className="max-w-4xl mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mapImage} alt={`${title}地圖`} className="w-full h-auto" loading="lazy" />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto h-64 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
              地圖
            </div>
          )}
        </div>

        <div className="mt-10">
          <Link
            href={`tel:${phone}`}
            className="inline-block bg-gray-900 hover:bg-black text-white font-bold px-12 py-4 rounded-md text-lg transition"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
