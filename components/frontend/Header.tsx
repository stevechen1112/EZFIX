import Link from "next/link";

function Logo({ color = "#1f4e9d" }: { color?: string }) {
  return (
    <svg viewBox="0 0 64 64" className="w-9 h-9 flex-shrink-0">
      <rect x="6" y="10" width="40" height="48" fill="none" stroke={color} strokeWidth="4" />
      <rect x="14" y="18" width="24" height="8" fill={color} />
      <path d="M30 32 L42 44 L56 22" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Header({ logoText, phone }: { logoText: string; phone: string }) {
  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-xl font-bold text-gray-900 tracking-wide">{logoText}</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
          <Link href="/#services" className="hover:text-brand-700">服務項目</Link>
          <Link href="/#areas" className="hover:text-brand-700">服務區域</Link>
          <Link href="/#reviews" className="hover:text-brand-700">客戶回饋</Link>
          <Link href="/blog" className="hover:text-brand-700">專業分享</Link>
          <Link href="/#contact" className="hover:text-brand-700">聯絡我們</Link>
        </nav>
        <Link
          href={`tel:${phone}`}
          className="md:hidden bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          📞 {phone}
        </Link>
      </div>
    </header>
  );
}
