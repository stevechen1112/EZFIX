import type { ServiceItem } from "@/types";

export function Services({ items, title }: { items: ServiceItem[]; title: string }) {
  return (
    <section id="services" className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-12">
          <h2 className="title-blue title-underline text-3xl md:text-4xl font-bold">{title}</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {items.map((s) => (
            <article key={s.id} className="service-card-2col flex flex-col">
              {s.image && (
                <div className="h-56 md:h-64 bg-gray-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              <div className="p-6 md:p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-700 leading-loose mb-5">{s.description}</p>
                <hr className="border-gray-200 my-4" />
                <ul className="space-y-2 text-gray-800">
                  {s.features.map((f, i) => (
                    <li key={i} className="leading-relaxed">
                      <span className="bullet-triangle">▶</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
