"use client";

import { useEffect, useState } from "react";
import type { ReviewItem } from "@/types";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-1 text-amber-400 text-xl">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < n ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export function Reviews({ items, title, subtitle }: { items: ReviewItem[]; title: string; subtitle: string }) {
  const [idx, setIdx] = useState(0);
  const total = items.length;

  useEffect(() => {
    if (total < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % total), 6000);
    return () => clearInterval(t);
  }, [total]);

  if (total === 0) return null;

  const current = items[idx];

  return (
    <section id="reviews" className="reviews-dark py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-white text-3xl md:text-4xl font-bold">{title}</h2>
          {subtitle && <p className="mt-4 text-white/80">{subtitle}</p>}
        </div>

        <div className="review-card-light">
          <Stars n={current.rating} />
          <p className="mt-4 text-gray-800 leading-loose text-base md:text-lg">{current.content}</p>
          <div className="mt-6 flex items-center gap-3">
            {current.avatar ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={current.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                {current.name.charAt(0)}
              </div>
            )}
            <div className="font-semibold text-gray-800">{current.name}</div>
          </div>
        </div>

        {total > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`dot-indicator ${i === idx ? "active" : ""}`}
                aria-label={`第 ${i + 1} 則評論`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
