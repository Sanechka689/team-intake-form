import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="inline-flex items-center gap-3">
          <img src="/agenstvo-logo.svg" alt="Agensvo" className="h-9 w-9" />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">Market Agensvo</p>
            <p className="text-xs text-slate-500">Командная анкета проекта</p>
          </div>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/instruction" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
            Инструкция
          </Link>
          <Link href="/form" className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Начни отсюда
          </Link>
        </nav>
      </div>
    </header>
  );
}
