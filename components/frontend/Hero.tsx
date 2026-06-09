"use client";

import { useEffect, useState } from "react";
import type { HeroSlideItem } from "@/types";

export function Hero({
  slides,
  fallbackBadge,
  fallbackSubtitle,
}: {
  slides: HeroSlideItem[];
  fallbackBadge: string;
  fallbackSubtitle: string;
}) {
  const [idx, setIdx] = useState(0);
  const list = slides.length > 0 ? slides : [];

  useEffect(() => {
    if (list.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % list.length), 5000);
    return () => clearInterval(t);
  }, [list.length]);

  const current = list[idx];
  const title = current?.title || fallbackBadge;
  // 副標用 ｜ 分隔成兩行（原站風格）
  const subs = (current?.subtitle || fallbackSubtitle)
    .split(/[｜|]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section
      className="hero-wrap"
      style={{
        backgroundImage: current?.image ? `url(${current.image})` : undefined,
      }}
    >
      <div className="relative z-10 text-center text-white px-4 py-20">
        <h1 className="text-4xl md:text-6xl font-black tracking-wide drop-shadow-lg">
          {title}
        </h1>
        <div className="mt-6 text-lg md:text-2xl font-medium text-white/95 leading-relaxed">
          {subs.map((s, i) => (
            <p key={i} className="block">
              {i > 0 && subs.length > 1 && <span className="opacity-60 mx-2">｜</span>}
              {s}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
