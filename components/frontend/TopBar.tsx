import Link from "next/link";

export function TopBar({ phone, lineUrl }: { phone: string; lineUrl: string }) {
  return (
    <div className="hidden md:block bg-brand-700 text-white text-sm">
      <div className="mx-auto max-w-6xl px-4 py-2 flex justify-end gap-4">
        <Link href={`tel:${phone}`} className="hover:text-amber-300 transition flex items-center gap-1">
          📞 來電諮詢
        </Link>
        {lineUrl && (
          <Link
            href={lineUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-300 transition flex items-center gap-1"
          >
            💬 LINE 諮詢
          </Link>
        )}
      </div>
    </div>
  );
}
