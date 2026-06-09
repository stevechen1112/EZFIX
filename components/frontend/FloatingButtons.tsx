import Link from "next/link";

export function FloatingButtons({
  phone,
  lineUrl,
  phoneLabel,
  lineLabel,
  mobilePhoneLabel,
  mobileLineLabel,
}: {
  phone: string;
  lineUrl: string;
  phoneLabel: string;
  lineLabel: string;
  mobilePhoneLabel: string;
  mobileLineLabel: string;
}) {
  return (
    <>
      {/* 桌面版浮動 CTA（畫面右側垂直置中） */}
      <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
        <Link href={`tel:${phone}`} className="floating-pill floating-pill-phone">
          📞 {phoneLabel}
        </Link>
        {lineUrl && (
          <Link href={lineUrl} target="_blank" rel="noreferrer" className="floating-pill floating-pill-line">
            💬 {lineLabel}
          </Link>
        )}
      </div>

      {/* 手機版底部浮動按鈕列 */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-lg flex">
        <Link href={`tel:${phone}`} className="flex-1 py-3 flex flex-col items-center gap-1 text-gray-700">
          <span className="text-xl">📞</span>
          <span className="text-xs">{mobilePhoneLabel}</span>
        </Link>
        {lineUrl && (
          <Link href={lineUrl} target="_blank" rel="noreferrer" className="flex-1 py-3 flex flex-col items-center gap-1 text-gray-700 border-l">
            <span className="text-xl">💬</span>
            <span className="text-xs">{mobileLineLabel}</span>
          </Link>
        )}
      </div>
    </>
  );
}
